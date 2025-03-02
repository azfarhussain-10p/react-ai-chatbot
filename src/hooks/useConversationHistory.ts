// src/hooks/useConversationHistory.ts
import { useState, useEffect } from "react";
import type { ChatMessage } from "../assistants";

export function useConversationHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("conversationHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("conversationHistory", JSON.stringify(messages));
  }, [messages]);

  return {
    messages,
    setMessages,
    addMessage: (message: ChatMessage) =>
      setMessages(prev => [...prev, message]),
    updateLastMessage: (content: string) =>
      setMessages(prev => {
        const last = prev[prev.length - 1];
        return last ? [...prev.slice(0, -1), { ...last, content }] : prev;
      })
  };
}