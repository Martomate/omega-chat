import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { NextResponse } from "next/server";
import { env } from "process";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const enabled = true;

export type HistoryItem = { prompt: string; response: string };

export type PromptInput = { prompt: string; history: HistoryItem[] };
export type PromptResponse = { response: string };

const openAiKey = env.OPENAI_KEY;
if (!openAiKey?.length) throw new Error("No OpenAI key provided!");

const performPrompt = async (prompt: string, history: HistoryItem[]) => {
  const model = new OpenAI({ openAIApiKey: openAiKey });
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(
      history.flatMap((h) => [
        new HumanChatMessage(h.prompt),
        new AIChatMessage(h.response),
      ])
    ),
  });
  const chain = new ConversationChain({ llm: model, memory: memory });
  const { response } = await chain.call({ input: prompt });
  return response;
};

export async function POST(req: Request) {
  const { prompt, history }: PromptInput = await req.json();

  const response = await (enabled
    ? performPrompt(prompt, history)
    : sleep(1000).then(() => "test"));

  const res: PromptResponse = { response };

  return NextResponse.json(res);
}
