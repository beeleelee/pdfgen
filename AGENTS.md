# pdfgen — Agents.md

## Architecture

Single-package repo: Vite React frontend (`src/`) + Express backend (`server/`), two separate TypeScript configs.

- **Dev**: `npm run dev` — runs `vite` (:5173) + `tsx watch server/index.ts` (:3001) via `concurrently`. Vite proxies `/api/*` → `:3001`.
- **Prod**: `npm run build` + `npm start` — Express serves built files from `dist/`.
- **Typecheck**: `npm run typecheck` — runs `tsc --noEmit` for both configs.

## Layout

```
src/               # Vite React (tsconfig.json)
  App.tsx           Entrypoint — two-panel layout
  components/
    Chat.tsx        useChat(@ai-sdk/react) + DefaultChatTransport(ai)
    FileUpload.tsx  Drag-and-drop .txt/.md, reads via FileReader
    PdfPreview.tsx  iframe → /api/pdf/:id
    Controls.tsx    Download (blob) + Clear

server/            # Express (tsconfig.server.json)
  index.ts          Entrypoint — mounts /api/chat, /api/pdf, /api/health
  routes/
    chat.ts         POST → streamText → pipeUIMessageStreamToResponse(res)
    pdf.ts          GET :id → pdfStore Map lookup
  agents/
    tools.ts        render_pdf tool stub (placeholder)
    system-prompt.ts
  templates/        Stubs only — not yet implemented
  pdf/generator.ts  pdfStore Map<string, Buffer> + storePdf()
  lib/
    llm.ts          getModel(): switches on LLM_PROVIDER env
```

## Key framework quirks (AI SDK v6)

- **Server**: `streamText({ model, messages, system, tools })` → `result.pipeUIMessageStreamToResponse(res)` — this sends SSE that `useChat` on the client understands.
- **Client**: `useChat` is imported from `@ai-sdk/react` (NOT `ai/react`). Uses `DefaultChatTransport({ api: '/api/chat' })`. API uses `sendMessage({ text })` (not `handleSubmit`), `status` (not `isLoading`), and `messages[N].parts` (not `.toolInvocations`).
- **Tools**: Use `inputSchema` (not `parameters`). `tool()` is a pass-through identity function. Model casts via `as unknown as LanguageModel`.
- **Messages have `parts` array**: Tool invocations appear as `{ type: 'tool-<name>', state: 'output-available', output: {...} }`. The tool part `type` is `tool-render_pdf` for the render_pdf tool.

## LLM provider switching

Set `LLM_PROVIDER=openai` (default, requires `OPENAI_API_KEY`) or `LLM_PROVIDER=ollama` (requires local Ollama at `OLLAMA_BASE_URL`). Model defaults: `gpt-4o` / `llama3.2`.

## Commands

| Command | What |
|---|---|
| `npm run dev` | Start both Vite + Express (dev) |
| `npm run typecheck` | tsc for both configs |
| `npm run build` | Vite production build |
| `npm start` | Express serves build (NODE_ENV=production) |
| `npm run playwright:install` | Download Chromium for PDF gen (needed for Phase 5) |

## Development state

- **Done**: Project scaffold (Phase 0), backend server (Phase 1), frontend shell (Phase 2).
- **Next**: LLM agent system with real template selection/filling (Phase 3), template React components (Phase 4), Playwright PDF gen (Phase 5).
- **Incomplete**: `render_pdf` tool is a stub returning `{ pdfId: 'placeholder' }`. All template `.tsx` files in `server/templates/` are stubs. `uuid`, `multer`, `react-dom/server` are installed but unused. No tests exist.
- **Env**: Copy `.env.example` to `.env` and set `OPENAI_API_KEY` (or `LLM_PROVIDER=ollama`).
