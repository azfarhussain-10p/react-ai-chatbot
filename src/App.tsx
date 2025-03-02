import { JSX, useState, useCallback, useEffect } from 'react';
import styles from './App.module.css';
import { ChatError } from './utils/errorHandling';
import { ToastProvider } from './contexts/ToastContext';
import { useNotifications } from './utils/notifications';
import { createAssistant, ModelType, ChatMessage } from "./assistants";
import {
  Chat,
  Controls,
  Loader,
  SettingsPanel,
  ConversationHistory,
  ThemeToggle
} from "./components";
import {
  useTheme,
  useRateLimiter,
  useConversationHistory
} from "./hooks";

// Wrap your main App component
function Root() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

function App(): JSX.Element {
  const { showUserNotification, logErrorToService } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { messages, setMessages, addMessage, updateLastMessage } = useConversationHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('chatgpt');
  const [conversations, setConversations] = useState<Array<{
    id: string;
    messages: ChatMessage[];
    timestamp: Date;
  }>>([]);

  const [rateLimit, setRateLimit] = useState(() => {
    const saved = localStorage.getItem('rateLimit');
    return saved ? Math.min(20, Math.max(1, Number(saved))) : 10;
  });
  const {
    isLimited,
    checkLimit,
    currentCount,
    maxRequests
  } = useRateLimiter(rateLimit);

  const handleError = useCallback((error: unknown) => {
    const defaultMessage = "An unexpected error occurred. Please try again.";

    if (error instanceof ChatError) {
      showUserNotification(error.message);
    } else {
      logErrorToService(error);
      showUserNotification(defaultMessage);
    }
  }, [showUserNotification, logErrorToService]);

  const handleContentSend = useCallback(async (content: string) => {
    if (isLimited) {
      showUserNotification(`Rate limit exceeded (${currentCount}/${rateLimit})`, 'warning');
      return;
    }

    try {
      const assistant = createAssistant(selectedModel);
      addMessage({ content, role: 'user' });
      setIsLoading(true);
      checkLimit();

      const stream = await assistant.chatStream(content);
      let accumulatedContent = '';
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) {
          addMessage({ content: '', role: 'assistant' });
          setIsLoading(false);
          setIsStreaming(true);
          isFirstChunk = false;
        }
        accumulatedContent += chunk;
        updateLastMessage(accumulatedContent);
      }

      // Add to conversation history
      setConversations(prev => [...prev, {
        id: Date.now().toString(),
        messages: [...messages, { role: 'user', content }, { role: 'assistant', content: accumulatedContent }],
        timestamp: new Date()
      }]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [selectedModel, isLimited, checkLimit, addMessage, updateLastMessage, messages, handleError]);

  // Load initial conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  return (
    <div className={`${styles.appContainer} ${theme}`}>
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            className={styles.settingsButton}
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>

        <div className={styles.headerCenter}>
          <h1 className={styles.appTitle}>AI Chat Assistant</h1>
        </div>

        <div className={styles.headerRight}>
          <ConversationHistory
            conversations={conversations}
            onSelect={(selectedMessages) => {
              setMessages(selectedMessages);
            }}
            currentMessages={messages}
          />
        </div>
      </header>

      <main className={styles.chatWrapper}>
        <Chat messages={messages} />
        {isLoading && <Loader />}
      </main>

      <Controls
        isDisabled={isLoading || isStreaming || isLimited}
        onSend={handleContentSend}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <footer className={styles.appFooter}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} 10Pearls Pakistan.
          Developed by Syed Azfar Hussain, Principal Test Consultant.
        </p>
      </footer>
    </div>
  );
}

export default Root;