import { createOpenAI } from '@ai-sdk/openai'
import { ollama } from 'ai-sdk-ollama'
import type { LanguageModel } from 'ai'

export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER || 'openai'

  if (provider === 'ollama') {
    const model = process.env.OLLAMA_MODEL || 'llama3.2'
    return ollama(model) as unknown as LanguageModel
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  })
  const model = process.env.OPENAI_MODEL || 'gpt-4o'
  return openai.chat(model) as unknown as LanguageModel
}
