import { useRef, useEffect, useMemo, JSX } from "react";
import Markdown from "react-markdown";
import styles from "./Chat.module.css";

export interface ChatMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

const WELCOME_MESSAGE_GROUP: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello! How can I assist you right now?",
  },
];

interface ChatProps {
  messages: ChatMessage[];
}

export function Chat({ messages }: ChatProps): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by starting a new group whenever a message with role "user" is encountered.
  const messagesGroups = useMemo((): ChatMessage[][] => {
    return messages.reduce((groups: ChatMessage[][], message: ChatMessage) => {
      if (groups.length === 0 || message.role === "user") {
        groups.push([]);
      }
      groups[groups.length - 1].push(message);
      return groups;
    }, [] as ChatMessage[][]);
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map((groupMessages, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {groupMessages.map(({ role, content }, index) => (
            <div key={index} className={styles.Message} data-role={role}>
              <Markdown>{content}</Markdown>
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
