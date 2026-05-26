import { Router } from 'express'

const router = Router()

router.post('/', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
