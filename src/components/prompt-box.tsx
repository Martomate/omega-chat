"use client";

import { HistoryItem, PromptResponse } from "@/app/api/prompt/route";
import { useState } from "react";

const performPrompt = async (prompt: string, history: HistoryItem[]) => {
  const res = await fetch("/api/prompt", {
    method: "POST",
    body: JSON.stringify({ prompt, history }),
  });
  const { response }: PromptResponse = await res.json();
  return response;
};

type HistoryRowProps = { index: number; message: string; isHuman: boolean };
type NameProps = { bgColor: string; borderColor: string; children: any };
type MessageProps = { borderColor: string; children: any };

const Name = ({ bgColor, borderColor, children }: NameProps) => (
  <div
    className={`p-1 text-xs text-center align-middle rounded-md border ${borderColor} ${bgColor}`}
  >
    {children}
  </div>
);

const Message = ({ borderColor, children }: MessageProps) => (
  <p
    className={`p-1 w-full bg-slate-950 rounded-md border border-solid ${borderColor}`}
  >
    {children}
  </p>
);

const HistoryRow = ({ index, message, isHuman }: HistoryRowProps) => {
  const nameTag = !isHuman ? (
    <Name bgColor="bg-blue-900" borderColor="border-blue-600">
      AI
    </Name>
  ) : (
    <Name bgColor="bg-green-900" borderColor="border-green-600">
      You
    </Name>
  );

  const messageTag = isHuman ? (
    <Message borderColor="border-green-500">{message}</Message>
  ) : (
    <Message borderColor="border-blue-500">{message}</Message>
  );

  return (
    <div
      key={index}
      className="p-1 w-full grid grid-flow-col grid-cols-[2rem,auto,2rem] items-center gap-1"
    >
      {isHuman ? <div></div> : nameTag}
      {messageTag}
      {isHuman ? nameTag : <div></div>}
    </div>
  );
};

export default function PromptBox() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const submitPrompt = async () => {
    if (!prompt.length) return;
    setPrompt("");
    const currentHistory = [...history];
    setHistory([...currentHistory, { prompt, response: "..." }]);
    const text = await performPrompt(prompt, history);
    setHistory([...currentHistory, { prompt, response: text }]);
  };

  return (
    <div className="flex flex-col items-center w-[32rem]">
      {history.length ? (
        <div className="min-w-full">
          {history.map(({ prompt, response }, index) => (
            <>
              <HistoryRow index={2 * index} message={prompt} isHuman={true} />
              <HistoryRow
                index={2 * index + 1}
                message={response}
                isHuman={false}
              />
            </>
          ))}
        </div>
      ) : undefined}
      <p className="mb-2 mt-8">Enter prompt below</p>
      <textarea
        className="border border-solid border-green-600 rounded-md bg-slate-950 mb-3 p-1 outline-none focus:border-green-400"
        rows={4}
        cols={40}
        onChange={(e) => setPrompt(e.target.value)}
        onSubmit={submitPrompt}
        value={prompt}
      />
      <button
        className="border border-solid border-blue-600 rounded-md bg-slate-950 mb-3 p-1 outline-none focus:border-blue-400"
        onClick={submitPrompt}
      >
        Submit
      </button>
    </div>
  );
}
