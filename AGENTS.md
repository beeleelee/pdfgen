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
    tools.ts        render_pdf tool (registry lookup, Zod validation, React SSR, Playwright PDF)
    system-prompt.ts
  templates/        React components + Zod schemas + typed registry
  pdf/generator.ts  pdfStore + storePdf() + generatePdf() (Playwright)
  lib/
    llm.ts          getModel(): switches on LLM_PROVIDER env
```

## Key framework quirks (AI SDK v6)

- **Server**: `streamText({ model, messages, system, tools })` → `result.pipeUIMessageStreamToResponse(res)` — this sends SSE that `useChat` on the client understands.
- **Client**: `useChat` is imported from `@ai-sdk/react` (NOT `ai/react`). Uses `DefaultChatTransport({ api: '/api/chat' })`. API uses `sendMessage({ text })` (not `handleSubmit`), `status` (not `isLoading`), and `messages[N].parts` (not `.toolInvocations`).
- **Tools**: Use `inputSchema` (not `parameters`). `tool()` is a pass-through identity function. Model casts via `as unknown as LanguageModel`.
- **Messages have `parts` array**: Tool invocations appear as `{ type: 'tool-<name>', state: 'output-available', output: {...} }`. The tool part `type` is `tool-render_pdf` for the render_pdf tool.

## LLM provider switching

Set `LLM_PROVIDER=openai` (default, requires `OPENAI_API_KEY`) or `LLM_PROVIDER=ollama` (requires local Ollama at `OLLAMA_BASE_URL`). Override models via `OPENAI_MODEL` (default: `gpt-4o`) or `OLLAMA_MODEL` (default: `llama3.1`). Recommended Ollama models with good tool calling support: `llama3.1`, `mistral`, `qwen2.5`, `phi-4`.

## Commands

| Command | What |
|---|---|
| `npm run dev` | Start both Vite + Express (dev) |
| `npm run typecheck` | tsc for both configs |
| `npm run build` | Vite production build |
| `npm start` | Express serves build (NODE_ENV=production) |
| `npm run playwright:install` | Download Chromium for PDF gen (needed for Phase 3) |

## Development state

- **Done**: Phase 0 (scaffold), Phase 1 (backend), Phase 2 (frontend), Phase 3 (LLM agent), Phase 4 (styling polish), Phase 5 (PDF optimization).
- **Phase 4 details**: Shared design token theme; redesigned invoice, resume, and letter templates with professional layout, consistent colors, and improved typography.
- **Phase 5 details**: Playwright `displayHeaderFooter` with page numbers and date; Google Fonts (Inter) embedded; optional watermark overlay (LLM-controlled via `watermark` field on `render_pdf`); periodic cleanup of PDFs older than 1 hour.
- **Next**: Testing, bug fixes, removing unused deps (`multer`), adding test prompts.
- **Incomplete**: No tests exist.
- **Env**: Copy `.env.example` to `.env` and set `OPENAI_API_KEY` (or `LLM_PROVIDER=ollama`). Run `npm run playwright:install` before using PDF generation if Chromium is not already installed.
