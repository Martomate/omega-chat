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
    <div className="flex flex-col items-center">
      {history.length ? (
        <div className="min-w-full">
          {history.map(({ prompt, response }, index) => (
            <div key={index} className="p-1 max-w-md">
              <p className="text-xs mt-1 p-1">You:</p>
              <p className="p-1 bg-slate-950 rounded-md border border-solid border-green-500">
                {prompt}
              </p>
              <p className="text-xs mt-3 p-1">AI:</p>
              <p className="p-1 bg-slate-950 rounded-md border border-solid border-blue-500">
                {response}
              </p>
            </div>
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
