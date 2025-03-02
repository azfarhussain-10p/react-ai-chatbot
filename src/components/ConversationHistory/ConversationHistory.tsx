// src/components/ConversationHistory/ConversationHistory.tsx
import { JSX } from 'react';
import type { ChatMessage } from '../../assistants';
import styles from './ConversationHistory.module.css';

interface ConversationHistoryProps {
  conversations: Array<{ id: string; messages: ChatMessage[]; timestamp: Date }>;
  onSelect: (messages: ChatMessage[]) => void;
  currentMessages: ChatMessage[];
}

export function ConversationHistory({
  conversations,
  onSelect,
  currentMessages,
}: ConversationHistoryProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Conversation History</h3>
      <ul className={styles.list}>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            className={styles.item}
            onClick={() => onSelect(conversation.messages)}
          >
            <span className={styles.date}>
              {new Date(conversation.timestamp).toLocaleString()}
            </span>
            <span className={styles.preview}>
              {conversation.messages[0]?.content.substring(0, 40)}...
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}