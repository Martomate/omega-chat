"use client";

import { PromptResponse } from "@/app/api/prompt/route";
import { useState } from "react";

const performPrompt = async (prompt: string) => {
  const res = await fetch("/api/prompt", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  const { response }: PromptResponse = await res.json();
  return response;
};

type HistoryItem = { prompt: string; response: string };

export default function PromptBox() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string | undefined>();

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const submitPrompt = async () => {
    const text = await performPrompt(prompt);
    setResponse(text);
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
          {history.map(({ prompt, response }) => (
            <>
              <hr />
              <p>
                You: <span>{prompt}</span>
              </p>
              <p>
                AI: <span>{response}</span>
              </p>
            </>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}
