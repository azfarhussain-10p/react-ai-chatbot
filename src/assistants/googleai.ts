import { GoogleGenerativeAI } from "@google/generative-ai";
import { IAIAssistant, AssistantConfig, ChatMessage } from "./types";
import { ChatError } from "../utils/errorHandling";

export class GoogleAIAssistant implements IAIAssistant {
  private genAI: GoogleGenerativeAI;
  private model: string;
  private chatSession: any;

  constructor(config: AssistantConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || "gemini-1.5-pro"; // Matches display name
    this.chatSession = this.genAI
      .getGenerativeModel({ model: this.model })
      .startChat({ history: [] });
  }

  async chat(content: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const mappedHistory = this.mapHistory(history);
      const result = await this.chatSession.sendMessage({
        contents: [...mappedHistory, { role: "user", parts: [{ text: content }] }]
      });
      return result.response.text();
    } catch (error) {
      throw new ChatError(
        "API",
        "GEMINI_API_ERROR",
        `Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          metadata: {
            service: "Google Gemini"
          },
          retryable: true
        }
      );
    }
  }

  async *chatStream(content: string, history: ChatMessage[] = []): AsyncGenerator<string> {
    try {
      const mappedHistory = this.mapHistory(history);
      const result = await this.chatSession.sendMessageStream({
        contents: [...mappedHistory, { role: "user", parts: [{ text: content }] }]
      });

      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    } catch (error) {
      throw new ChatError(
        "API",
        "GEMINI_API_ERROR",
        `Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          metadata: {
            service: "Google Gemini"
          },
          retryable: true
        }
      );
    }
  }

  private mapHistory(history: ChatMessage[]) {
    return history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
  }
}