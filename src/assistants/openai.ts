import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class Assistant {
  #client;
  #model: string;

  constructor(model: string = "gpt-4o-mini", client = openai) {
    this.#client = client;
    this.#model = model;
  }

  async chat(content: string, history: ChatMessage[]): Promise<string> {
    try {
      const result = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      const messageContent = result.choices[0].message.content;
      if (messageContent === null) {
        throw new Error("No content returned from API");
      }
      return messageContent;
    } catch (error: unknown) {
      throw error;
    }
  }

  async *chatStream(content: string, history: ChatMessage[] = []): AsyncGenerator<string, void, unknown> {
    try {
      const result = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
