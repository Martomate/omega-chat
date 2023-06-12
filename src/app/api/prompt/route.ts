import { NextResponse } from "next/server";

export type PromptInput = { prompt: string };
export type PromptResponse = { response: string };

export async function POST(req: Request) {
  const { prompt }: PromptInput = await req.json();

  const res: PromptResponse = { response: `You said "${prompt}".` };

  return NextResponse.json(res);
}
