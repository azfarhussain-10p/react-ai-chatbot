import { OpenAI } from "openai";
import { IAIAssistant, AssistantConfig, ChatMessage } from "./types";
import { ChatError } from "../utils/errorHandling";

export class OpenAIAssistant implements IAIAssistant {
  private client: OpenAI;
  private model: string;

  constructor(config: AssistantConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: true
    });
    this.model = config.model || "gpt-4"; // Matches display name
  }

  async chat(content: string, history: ChatMessage[] = []) {
    try {
      const result = await this.client.chat.completions.create({
        model: this.model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices[0]?.message?.content || "";
    } catch (error) {
      throw new ChatError(
        "API",
        "OPENAI_API_ERROR",
        `OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          metadata: {
            service: "OpenAI",
            statusCode: error instanceof OpenAI.APIError ? error.status : undefined
          },
          retryable: true
        }
      );
    }
  }

  async *chatStream(content: string, history: ChatMessage[] = []) {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      throw new ChatError(
        "API",
        "OPENAI_API_ERROR",
        `OpenAI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          metadata: {
            service: "OpenAI",
            statusCode: error instanceof OpenAI.APIError ? error.status : undefined
          },
          retryable: true
        }
      );
    }
  }
}