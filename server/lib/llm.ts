import { createOpenAI } from '@ai-sdk/openai'
import { ollama } from 'ai-sdk-ollama'
import type { LanguageModel } from 'ai'

export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER || 'openai'

  if (provider === 'ollama') {
    return ollama('llama3.2') as unknown as LanguageModel
  }

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  return openai('gpt-4o') as unknown as LanguageModel
}
