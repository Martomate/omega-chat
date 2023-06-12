import { NextResponse } from "next/server";
import { OpenAiClient } from "./OpenAI";
import { env } from "process";

export type PromptInput = { prompt: string };
export type PromptResponse = { response: string };

const openAiKey = env.OPENAI_KEY;
if (!openAiKey?.length) throw new Error("No OpenAI key provided!");
const openAi = new OpenAiClient(openAiKey);

export async function POST(req: Request) {
  const { prompt }: PromptInput = await req.json();

  const response = await openAi.prompt(prompt);

  const res: PromptResponse = { response };

  return NextResponse.json(res);
}
