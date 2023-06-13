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
    className={`p-1 w-full bg-slate-950 rounded-md border border-solid ${borderColor} whitespace-pre-wrap font-mono`}
  >
    {children}
  </p>
);

export const HistoryRow = ({ index, message, isHuman }: HistoryRowProps) => {
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
