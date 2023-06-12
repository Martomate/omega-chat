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
    const text = await performPrompt(prompt, history);
    setHistory([...history, { prompt, response: text }]);
  };

  return (
    <div className="flex flex-col items-center">
      <p>Enter prompt below</p>
      <textarea
        className="border-2 border-solid border-slate-200 bg-slate-900 mb-3"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        className="border-2 border-solid border-slate-200 rounded-md bg-slate-800 mb-3"
        onClick={submitPrompt}
      >
        Submit
      </button>
      {history.length ? (
        <div>
          {history.map(({ prompt, response }, index) => (
            <div key={index}>
              <hr />
              <p>
                You: <span>{prompt}</span>
              </p>
              <p>
                AI: <span>{response}</span>
              </p>
            </div>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}
