import OpenAI from "openai";
import { Assistant as OpenAIAssistant } from "../assistants/openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: import.meta.env.VITE_DEEPSEEK_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class Assistant extends OpenAIAssistant {
  constructor(model: string = "deepseek-chat", client = openai) {
    super(model, client);
  }
}
