import { Router } from 'express'

const router = Router()

router.get('/:id', (_req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
