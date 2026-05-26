import { Router } from 'express'
import { streamText, convertToModelMessages } from 'ai'
import { getModel } from '../lib/llm.js'
import { SYSTEM_PROMPT } from '../agents/system-prompt.js'
import { tools } from '../agents/tools.js'

const router = Router()

router.post('/', async (req, res) => {
  const { messages } = req.body

  const result = streamText({
    model: getModel(),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools,
  })

  result.pipeUIMessageStreamToResponse(res, {
    originalMessages: messages,
  })
})

export default router
