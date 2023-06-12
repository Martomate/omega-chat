import { NextRequest, NextResponse } from "next/server";

export type HelloInput = { name: string };
export type HelloResponse = { text: string };

export async function POST(req: Request) {
  const { name }: HelloInput = await req.json();
  return NextResponse.json({ text: `Hello ${name}!` });
}
