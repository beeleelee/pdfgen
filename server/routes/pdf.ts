import { Router } from 'express'
import { getPdf } from '../pdf/generator.js'

const router = Router()

router.get('/:id', (req, res) => {
  const pdf = getPdf(req.params.id)
  if (!pdf) {
    res.status(404).json({ error: 'PDF not found' })
    return
  }
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${req.params.id}.pdf"`)
  res.send(pdf)
})

export default router
