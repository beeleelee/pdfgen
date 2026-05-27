# pdfgen — AI-Powered PDF Generator

Generate PDF documents (resumes, invoices, letters, and more) through natural language chat. React + Vite frontend, Express backend — an LLM agent fills templates and renders them to PDF via Playwright.

## Quick Start

```bash
cp .env.example .env   # Edit .env with your API key
npm install
npm run playwright:install   # Download Chromium (required before first PDF)
npm run dev                  # Start dev server
```

Open `http://localhost:5173` and describe the document you want in the chat.

## Architecture

Single-package repo: Vite React frontend + Express backend, two separate TypeScript configs.

- **Dev**: `npm run dev` starts Vite (`:5173`) + tsx watch (`:3001`) via `concurrently`. Vite proxies `/api/*` → `:3001`.
- **Prod**: `npm run build` → `npm start` — Express serves built `dist/` files.

## Layout

```
src/                 # React frontend
  App.tsx            Entrypoint — single-column centered layout
  components/
    Chat.tsx         Chat textarea + message list + PDF link
  index.css         Tailwind + custom styles
  main.tsx          React mount point

server/              # Express backend
  index.ts           Entrypoint — mounts all routes
  routes/
    chat.ts          POST /api/chat — streamText → SSE streaming response
    pdf.ts           GET /api/pdf/:id — returns generated PDF by ID
    render-test.ts   POST /api/render-test — debug endpoint for template rendering
  agents/
    tools.ts         render_pdf tool (registry lookup, Zod validation, React SSR, Playwright PDF)
    system-prompt.ts LLM system prompt
  templates/         React components + Zod schemas + typed registry
    theme.ts         Design tokens (colors, fonts, spacing, gradients)
    resume.tsx       Resume template
    invoice.tsx      Invoice template
    letter.tsx       Letter template
    registry.ts      Template registry
  pdf/
    generator.ts     PDF storage and Playwright generation
  lib/
    llm.ts           Model selection (OpenAI / Ollama switching)
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite + Express concurrently (dev) |
| `npm run typecheck` | TypeScript check for both tsconfigs |
| `npm run build` | Vite production build |
| `npm start` | Express production server (`NODE_ENV=production`) |
| `npm run playwright:install` | Download Chromium (required for PDF generation) |

## LLM Configuration

Set the `LLM_PROVIDER` environment variable:

### OpenAI-compatible (default)

Works with DeepSeek, Doubao (Volcengine), OpenAI, or any service supporting the OpenAI Chat API.

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxxx
OPENAI_MODEL=Doubao-Seed-2.0-pro
OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

### Ollama (local)

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/api
OLLAMA_MODEL=llama3.1
```

Recommended models: `llama3.1`, `mistral`, `qwen2.5`, `phi-4`

## Templates

### Resume

Fields: name, title, contact (email/phone/GitHub/location), summary, projects, experience, education, skills, certifications

- Auto-detects Chinese content and switches to localized labels (个人优势, 项目经历, 至今, 业绩, etc.)
- High-tech design:
  - Dark gradient header (navy → blue), white text
  - Dot grid background pattern
  - Gradient underlines (blue → cyan) for section headers
  - Timeline-style entries (blue vertical line + dot markers)
  - Outlined skill pills (transparent bg, colored borders)
  - Achievement badges in cyan
- Paragraphs split on `\n` / `\n\n` rendered as separate blocks (no extra line spacing)

### Invoice

Fields: invoice number, dates, sender/recipient info, line items, subtotal/tax/total, notes

### Letter

Fields: date, recipient, subject, body, closing, signature, sender

## Design System

Tokens defined in `server/templates/theme.ts`:

| Token | Value |
|---|---|
| Primary | `#1e40af` |
| Accent | `#2563eb` |
| Tech cyan | `#06b6d4` |
| Header gradient | `linear-gradient(135deg, #0f172a, #1e3a5f)` |
| Underline gradient | `linear-gradient(90deg, #3b82f6, #06b6d4)` |
| Fonts | Inter, Georgia, JetBrains Mono |
| Font sizes | 9px – 30px |
| Spacing | 4px – 32px |

## AI SDK v6 Notes

- **Server**: `streamText({ model, messages, system, tools })` → `result.pipeUIMessageStreamToResponse(res)` for SSE
- **Client**: `useChat` from `@ai-sdk/react` (not `ai/react`). Uses `DefaultChatTransport`, `sendMessage({ text })`, `status`, `messages[N].parts`
- **Tools**: Use `inputSchema` (not `parameters`). `tool()` is a pass-through identity function.
- **Parts array**: Tool invocations appear as `{ type: 'tool-<name>', ... }` (e.g. `tool-render_pdf`)

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend port | `3001` |
| `LLM_PROVIDER` | Provider (openai / ollama) | `openai` |
| `OPENAI_API_KEY` | OpenAI-compatible API key | — |
| `OPENAI_MODEL` | Model name | `Doubao-Seed-2.0-pro` |
| `OPENAI_BASE_URL` | API base URL | — |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434/api` |
| `OLLAMA_MODEL` | Ollama model name | `llama3.1` |
