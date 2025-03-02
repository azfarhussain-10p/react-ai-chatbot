/**
 * Supported AI model types:
 * - `chatgpt`: GPT-4 (OpenAI)
 * - `gemini`: Gemini 1.5 Pro (Google)
 * - `deepseek`: DeepSeek Chat (DeepSeek)
 */
export type ModelType = "chatgpt" | "gemini" | "deepseek";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface IAIAssistant {
  chatStream(content: string, history?: ChatMessage[]): AsyncGenerator<string>;
  chat(content: string, history?: ChatMessage[]): Promise<string>;
}

export interface AssistantConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}