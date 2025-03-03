import { GoogleGenerativeAI } from "@google/generative-ai";

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export class Assistant {
  #chat: any;

  constructor(model: string = "gemini-1.5-flash") {
    const gemini = googleai.getGenerativeModel({ model });
    this.#chat = gemini.startChat({ history: [] });
  }

  async chat(content: string): Promise<string> {
    try {
      const result = await this.#chat.sendMessage(content);
      return result.response.text();
    } catch (error: unknown) {
      throw error;
    }
  }

  async *chatStream(content: string): AsyncGenerator<string, void, unknown> {
    try {
      const result = await this.#chat.sendMessageStream(content);

      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
