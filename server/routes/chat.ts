// Module: server/routes/chat.ts — Chat endpoint for the AI SDK.
// Receives message history, streams LLM responses (including tool calls) back
// to the client via Server-Sent Events (SSE).

import { Router } from 'express'
import { streamText, convertToModelMessages } from 'ai'
import { getModel } from '../lib/llm.js'
import { SYSTEM_PROMPT } from '../agents/system-prompt.js'
import { tools } from '../agents/tools.js'

const router = Router()

/**
 * POST /api/chat
 *
 * Receives an array of messages (with parts), converts them to the model's
 * internal format, and streams the response via pipeUIMessageStreamToResponse.
 * The client uses @ai-sdk/react's useChat hook with DefaultChatTransport.
 */
router.post('/', async (req, res) => {
  const { messages } = req.body

  // streamText is the AI SDK v6 function for streaming model responses.
  // It handles tool execution, error recovery, and message accumulation.
  const result = streamText({
    model: getModel(),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools,
  })

  // Pipes the UI-oriented SSE stream to the Express response.
  // originalMessages provides context for the SDK to merge tool results.
  result.pipeUIMessageStreamToResponse(res, {
    originalMessages: messages,
  })
})

export default router
