# DocChat: RAG chatbot over your PDFs

Upload PDFs (handbooks, SOPs, FAQs) and ask questions. Answers cite the document and page.

**Stack:** Next.js 16 · TypeScript · Drizzle ORM · Neon Postgres + pgvector · Google Gemini · Zustand · n8n

## Run
```bash
pnpm install
cp .env.example .env.local   # fill DATABASE_URL and GEMINI_API_KEY
pnpm dev                     # http://localhost:3000
```

## Architecture
```
Neon (pgvector) → src/server/db (Drizzle schema + client)
  → src/server/services   business rules + queries (session, document, chunk, usage)
  → src/server/usecases   one per service function (upload, ask, usage, purge)
  → src/server/api        one handler per use case (documents.post.ts, chat.post.ts…)
      re-exported by src/app/api/**/route.ts (Next.js convention)
  → src/stores            Zustand (settings, session, documents, chat, usage)
  → src/composables       use-api, use-session, use-documents, use-chat, use-usage
  → src/components        progress-bar, usage-panel, api-key-form, document-list, chat-panel
  → src/app               page.tsx (landing), chat/page.tsx
```

## How storage stays small
- PDFs are parsed in memory and thrown away. Only text chunks and 768-dimension embeddings are stored.
- No login: each visitor gets an httpOnly session cookie that expires after 24 hours.
- An n8n workflow deletes expired sessions every hour. Documents, chunks and usage rows go with them (`ON DELETE CASCADE`). Users can also click "Delete my data now".
- That workflow doesn't save successful runs, so your Supabase-backed n8n database stays small.
- Backup: `POST /api/cleanup` with header `x-cron-secret: $CRON_SECRET` does the same purge.

## Keys and limits
- Default key (`GEMINI_API_KEY`): capped per session in `src/server/lib/limits.ts`.
- Your own key: stored in sessionStorage, sent as the `x-gemini-key` header, never saved on the server.
- Rate-limit bars come from our own `usage_events` counters (Gemini doesn't return remaining quota). Chat token counts come from Gemini's `usageMetadata`; embedding tokens are estimated.

## Repositories
- `junior-dl/docchat-private` (private): all development happens here.
- `junior-dl/docchat` (public): read-only mirror of `main`, updated automatically by `.github/workflows/mirror-public.yml`. Don't open PRs or commit there.
