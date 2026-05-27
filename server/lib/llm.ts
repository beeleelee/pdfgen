// Module: server/lib/llm.ts — LLM provider abstraction.
// Switches between OpenAI and Ollama based on the LLM_PROVIDER env var.

import { createOpenAI } from '@ai-sdk/openai'
import { ollama } from 'ai-sdk-ollama'
import type { LanguageModel } from 'ai'

/**
 * Returns the LanguageModel instance based on environment configuration.
 *
 * Supports two providers:
 * - "openai" (default): uses @ai-sdk/openai, requires OPENAI_API_KEY
 * - "ollama": uses ai-sdk-ollama, requires local Ollama at OLLAMA_BASE_URL
 *
 * NOTE: The `as unknown as LanguageModel` cast is needed due to AI SDK v6's
 * type system not fully aligning with third-party provider wrappers.
 */
export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER || 'openai'

  if (provider === 'ollama') {
    const model = process.env.OLLAMA_MODEL || 'llama3.2'
    return ollama(model) as unknown as LanguageModel
  }

  // Default to OpenAI provider with optional custom base URL (e.g., for proxies)
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  })
  const model = process.env.OPENAI_MODEL || 'gpt-4o'
  return openai.chat(model) as unknown as LanguageModel
}
