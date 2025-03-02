import { OpenAI } from "openai";
import { IAIAssistant, AssistantConfig, ChatMessage } from "./types";
import { ChatError } from "../utils/errorHandling";

export class DeepSeekAssistant implements IAIAssistant {
  private client: OpenAI;
  private model: string;

  constructor(config: AssistantConfig) {
    this.client = new OpenAI({
      baseURL: config.baseURL || "https://api.deepseek.com/v1",
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });
    this.model = config.model || "deepseek-chat"; // Matches display name
  }

  async *chatStream(content: string, history: ChatMessage[] = []): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [...history, { role: "user", content }],
        stream: true,
      });

      for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      throw new ChatError(
        "API", // ErrorType
        "DEEPSEEK_API_ERROR", // ErrorCode
        `DeepSeek API Error: ${error instanceof Error ? error.message : 'Unknown error'}`, // Message
        {
          metadata: {
            service: "DeepSeek",
            statusCode: error instanceof OpenAI.APIError ? error.status : undefined
          },
          retryable: true
        }
      );
    }
  }

  async chat(content: string, history: ChatMessage[] = []): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [...history, { role: "user", content }],
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      throw new ChatError(
        "API", // ErrorType
        "DEEPSEEK_API_ERROR", // ErrorCode
        `DeepSeek API Error: ${error instanceof Error ? error.message : 'Unknown error'}`, // Message
        {
          metadata: {
            service: "DeepSeek",
            statusCode: error instanceof OpenAI.APIError ? error.status : undefined
          },
          retryable: true
        }
      );
    }
  }
}