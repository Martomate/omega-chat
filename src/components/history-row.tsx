export type Actor = "AI-1" | "AI-2" | "Human";

type HistoryRowProps = { index: number; message: string; actor: Actor };
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
    className={`p-1 w-full bg-slate-950 rounded-md border border-solid ${borderColor} whitespace-pre-wrap font-mono`}
  >
    {children}
  </p>
);

export const HistoryRow = ({ index, message, actor }: HistoryRowProps) => {
  const nameTag =
    actor === "Human" ? (
      <Name bgColor="bg-green-900" borderColor="border-green-600">
        You
      </Name>
    ) : actor === "AI-1" ? (
      <Name bgColor="bg-blue-900" borderColor="border-blue-600">
        AI
      </Name>
    ) : (
      <Name bgColor="bg-orange-900" borderColor="border-orange-600">
        AI 2
      </Name>
    );

  const messageTag =
    actor === "Human" ? (
      <Message borderColor="border-green-500">{message}</Message>
    ) : actor === "AI-1" ? (
      <Message borderColor="border-blue-500">{message}</Message>
    ) : (
      <Message borderColor="border-orange-500">{message}</Message>
    );

  return (
    <div
      key={index}
      className="p-1 w-full grid grid-flow-col grid-cols-[2rem,auto,2rem] items-center gap-1"
    >
      {actor !== "AI-1" ? <div></div> : nameTag}
      {messageTag}
      {actor !== "AI-1" ? nameTag : <div></div>}
    </div>
  );
};
