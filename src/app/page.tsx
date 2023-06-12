import PromptBox from "@/components/prompt-box";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-4xl mb-8">Omega Chat</p>
      <PromptBox />
    </main>
  );
}
