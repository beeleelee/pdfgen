# pdfgen — Implementation Plan

Generate PDFs from natural language using React + TypeScript + LLM agents.

## Architecture

```
User (chat / file upload)
       │
       ▼
┌─────────────────────────────────────────┐
│  Vite React Frontend (useChat hook)     │
│  - Chat interface                       │
│  - File upload (.txt / .md)             │
│  - PDF preview (iframe + blob URL)      │
│  - Download button                      │
└──────────────────┬──────────────────────┘
                   │ POST /api/chat
                   ▼
 ┌─────────────────────────────────────────┐
│  Node.js Backend (Express + Vercel AI)  │
│                                         │
│  Agent tool:                            │
│   render_pdf(template, data)            │
│     → registry lookup + Zod validate    │
│     → React renderToStaticMarkup        │
│     → Playwright HTML → PDF             │
│     → store + return pdfId              │
└─────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript + Tailwind CSS |
| Backend | Express + TypeScript |
| AI SDK | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/ollama`) |
| PDF | Playwright (HTML → PDF via headless Chromium) |
| Templates | React components → `renderToStaticMarkup` → HTML |
| Validation | Zod |
| Dev Runner | `tsx` (server), `concurrently` (both) |

## Project Structure

```
pdfgen/
├── package.json
├── tsconfig.json
├── tsconfig.server.json
├── vite.config.ts
├── .env.example
├── index.html                     # Vite entry
├── tailwind.config.ts
├── server/
│   ├── index.ts                   # Express server entry
│   ├── routes/
│   │   ├── chat.ts                # POST /api/chat (Vercel AI SDK)
│   │   └── pdf.ts                 # GET /api/pdf/:id (download/preview)
│   ├── agents/
│   │   ├── tools.ts               # Tool definitions for LLM
│   │   └── system-prompt.ts       # System prompt
│   ├── templates/
│   │   ├── registry.ts            # Template registry + schemas
│   │   ├── resume.tsx             # Resume template component
│   │   ├── invoice.tsx            # Invoice template component
│   │   └── letter.tsx             # Letter template component
│   ├── pdf/
│   │   └── generator.ts           # Playwright HTML → PDF
│   └── lib/
│       └── llm.ts                 # AI SDK model config (OpenAI / Ollama)
├── src/                           # Vite React frontend
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Chat.tsx
│   │   ├── FileUpload.tsx
│   │   ├── PdfPreview.tsx
│   │   └── Controls.tsx
│   └── lib/
│       └── api.ts
└── public/
    └── favicon.svg
```

## Phases

### ✅ Phase 0 — Project Scaffolding
- package.json with all deps and scripts
- TypeScript configs (client + server)
- Vite config with React plugin and API proxy
- Tailwind config
- .env.example
- Directory structure + placeholder files

### ✅ Phase 1 — Backend Server
- Express app with JSON parsing, CORS, static serving
- POST /api/chat route (Vercel AI SDK streamText)
- GET /api/pdf/:id route
- LLM provider factory (OpenAI / Ollama)

### ✅ Phase 2 — Frontend Shell
- Vite entry + root App component
- Chat interface (useChat hook, messages, input)
- File upload (drag-and-drop .txt/.md)
- PDF preview (iframe)
- Controls (download, regenerate)

### ✅ Phase 3 — LLM Agent System
- Typed template registry with Zod schemas per template
- Invoice, resume, letter React components with inline styles
- Dynamic system prompt built from registry
- Single `render_pdf` tool: registry lookup → Zod validation → React renderToStaticMarkup → Playwright PDF → store + return pdfId

### Phase 4 — Template Styling Polish
- Refine template inline styles or integrate Tailwind via a build step
- Responsive/professional visual polish

### Phase 5 — PDF Optimization
- Playwright headers, footers, and page numbers
- Custom fonts and watermarks
- Periodic in-memory PDF cleanup
