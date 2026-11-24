"use client";
import Link from "next/link";
import { useSession } from "@/composables/use-session";
import { useUsage } from "@/composables/use-usage";
import { useDocuments } from "@/composables/use-documents";
import { useChat } from "@/composables/use-chat";
import { UsagePanel } from "@/components/usage-panel";
import { ApiKeyForm } from "@/components/api-key-form";
import { DocumentList } from "@/components/document-list";
import { ChatPanel } from "@/components/chat-panel";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ChatPage() {
  const { ready, expiresAt, endNow } = useSession();
  const { usage, refresh } = useUsage();
  const docs = useDocuments(ready, refresh);
  const chat = useChat(refresh);
  return (
    <div className="flex h-dvh flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">D</span>
          DocChat
        </Link>
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          {expiresAt && <span className="hidden sm:inline">Auto-deletes {new Date(expiresAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>}
          <ThemeToggle />
          <button onClick={endNow} className="rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Delete my data</button>
        </div>
      </header>
      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 overflow-hidden p-4 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4 overflow-y-auto pb-4">
          <DocumentList items={docs.items} uploading={docs.uploading} error={docs.error} onUpload={docs.upload} onRemove={docs.remove} />
          <UsagePanel usage={usage} />
          <ApiKeyForm />
        </aside>
        <ChatPanel messages={chat.messages} pending={chat.pending} onAsk={chat.ask} disabled={!docs.items.length} />
      </main>
    </div>
  );
}
