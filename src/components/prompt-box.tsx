"use client";

import { HistoryItem, PromptResponse } from "@/app/api/prompt/route";
import { useEffect, useState } from "react";
import { HistoryRow } from "./history-row";

const performPrompt = async (prompt: string, history: HistoryItem[]) => {
  const res = await fetch("/api/prompt", {
    method: "POST",
    body: JSON.stringify({ prompt, history }),
  });
  const { response }: PromptResponse = await res.json();
  return response;
};

const shiftHistory = (
  initialMessage: string,
  history: HistoryItem[]
): {
  shiftedHistory: HistoryItem[];
  prompt: string;
} => {
  if (!history.length) return { shiftedHistory: [], prompt: initialMessage };

  const newHistory: HistoryItem[] = [];
  newHistory.push({ prompt: initialMessage, response: history[0].response });
  for (let i = 0; i < history.length - 1; i++) {
    newHistory.push({
      prompt: history[i].response,
      response: history[i + 1].prompt,
    });
  }

  return {
    shiftedHistory: newHistory,
    prompt: history[history.length - 1].response,
  };
};

type ChatDoubleRow = {
  prompt: string;
  response: string;
  promptWasAutomatic: boolean;
};

export default function PromptBox() {
  const [history, setHistory] = useState<ChatDoubleRow[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [promptWasAutomatic, setPromptWasAutomatic] = useState<boolean>(false);

  const [auto, setAuto] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

  const submitPrompt = async () => {
    if (!prompt.length) return;

    setPrompt("");
    const currentHistory = [...history];
    setHistory([
      ...currentHistory,
      { prompt, response: "...", promptWasAutomatic },
    ]);
    setWaiting(true);
    const text = await performPrompt(prompt, history);
    setWaiting(false);
    setHistory([
      ...currentHistory,
      { prompt, response: text, promptWasAutomatic },
    ]);
    setPromptWasAutomatic(false);
  };

  useEffect(() => {
    if (shouldSubmit) {
      setShouldSubmit(false);
      submitPrompt();
    }
  }, [shouldSubmit]);

  useEffect(() => {
    if (auto && !waiting && !prompt.length) {
      setWaiting(true);
      setPromptWasAutomatic(true);

      const { shiftedHistory, prompt } = shiftHistory(
        "Tell me something interesting",
        history
      );
      setPrompt("...");
      performPrompt(prompt, shiftedHistory).then(async (text) => {
        setWaiting(false);
        setPrompt(text);
        setPromptWasAutomatic(true);
        setShouldSubmit(true);
      });
    }
  }, [prompt, auto, waiting, history]);

  return (
    <div className="flex flex-col items-center w-[42rem] max-w-[42rem]">
      {history.length ? (
        <div className="min-w-full">
          {history.map(({ prompt, response, promptWasAutomatic }, index) => (
            <>
              <HistoryRow
                index={2 * index}
                message={prompt}
                actor={promptWasAutomatic ? "AI-2" : "Human"}
              />
              <HistoryRow
                index={2 * index + 1}
                message={response}
                actor={"AI-1"}
              />
            </>
          ))}
          {waiting && prompt.length ? (
            <HistoryRow
              index={2 * history.length}
              message={prompt}
              actor={promptWasAutomatic ? "AI-2" : "Human"}
            />
          ) : undefined}
        </div>
      ) : undefined}
      <p className="mb-2 mt-8">Enter prompt below</p>
      <textarea
        className={`border border-solid ${
          promptWasAutomatic ? "border-orange-600" : "border-green-600"
        } rounded-md bg-slate-950 mb-3 p-1 outline-none ${
          promptWasAutomatic
            ? "focus:border-orange-400"
            : "focus:border-green-400"
        }`}
        rows={4}
        cols={40}
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        disabled={promptWasAutomatic}
      />
      <button
        className="border border-solid border-blue-600 rounded-md bg-slate-950 mb-3 p-1 outline-none focus:border-blue-400"
        onClick={() => setShouldSubmit(true)}
        disabled={promptWasAutomatic}
      >
        Submit
      </button>
      <label>
        Automate &nbsp;
        <input
          type="checkbox"
          checked={auto}
          onChange={(e) => setAuto(e.target.checked)}
        />
      </label>
    </div>
  );
}
