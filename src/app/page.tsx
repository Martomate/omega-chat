import Hello from "@/components/hello";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello World! Text: <Hello />
    </main>
  );
}
