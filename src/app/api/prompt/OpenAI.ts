import { OpenAI } from "langchain/llms/openai";

export class OpenAiClient {
  constructor(private readonly apiKey: string) {}

  async prompt(message: string): Promise<string> {
    const model = new OpenAI({ openAIApiKey: this.apiKey });
    const res = await model.call(message);
    return Promise.resolve(res);
  }
}
