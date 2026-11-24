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

export default function ChatPage() {
  const { ready, expiresAt, endNow } = useSession();
  const { usage, refresh } = useUsage();
  const docs = useDocuments(ready, refresh);
  const chat = useChat(refresh);
  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <Link href="/" className="block text-lg font-semibold">DocChat</Link>
        <DocumentList items={docs.items} uploading={docs.uploading} error={docs.error} onUpload={docs.upload} onRemove={docs.remove} />
        <UsagePanel usage={usage} />
        <ApiKeyForm />
        <section className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600">
          {expiresAt && <p>Everything is deleted automatically at {new Date(expiresAt).toLocaleString()}.</p>}
          <button onClick={endNow} className="mt-2 text-red-600 underline">Delete my data now</button>
        </section>
      </aside>
      <ChatPanel messages={chat.messages} pending={chat.pending} onAsk={chat.ask} disabled={!docs.items.length} />
    </main>
  );
}
