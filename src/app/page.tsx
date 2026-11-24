import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const features = [
  { t: "Answers with citations", d: "Every answer links back to the document and page it came from, so you can check it." },
  { t: "Bring your own Gemini key", d: "Use the free default key to try it, or paste your own key for higher limits. Your key never leaves your browser tab." },
  { t: "Live token and rate-limit meters", d: "See tokens sent and received for every answer, and progress bars for per-minute and daily limits." },
  { t: "Deleted after 24 hours", d: "PDFs are read in memory and never stored. Text chunks and embeddings are deleted after 24 hours, or right away when you choose." },
];
const steps = ["Upload a PDF: a school handbook, an SOP, a business FAQ.", "It's split into chunks and embedded with Gemini into pgvector.", "Ask a question. The closest chunks are retrieved and Gemini answers using only those, with citations."];

export default function Home() {
  return (
    <main className="relative min-h-dvh bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-24 text-center">
        <p className="mb-4 inline-block rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">RAG · Gemini · pgvector</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Ask your documents.<br /><span className="text-indigo-600">Get answers you can verify.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">Upload a PDF and chat with it. Every answer cites the exact page it came from. No sign-up, and your data is deleted after 24 hours.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/chat" className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">Try it free</Link>
          <a href="#how" className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">How it works</a>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.t} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"><h3 className="font-semibold">{f.t}</h3><p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.d}</p></div>
        ))}
      </section>
      <section id="how" className="bg-zinc-50 dark:bg-zinc-800/60 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <ol className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-xl bg-white dark:bg-zinc-900 p-5 shadow-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">{i + 1}</span><p className="pt-1 text-zinc-700 dark:text-zinc-300">{s}</p></li>
            ))}
          </ol>
          <p className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-400">Built with Next.js, TypeScript, Drizzle ORM, Neon Postgres + pgvector, Google Gemini, Zustand and n8n.</p>
        </div>
      </section>
    </main>
  );
}
