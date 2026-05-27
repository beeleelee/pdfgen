// Module: server/routes/pdf.ts — PDF retrieval endpoint.
// Serves generated PDFs from the in-memory store by their UUID.

import { Router } from 'express'
import { getPdf } from '../pdf/generator.js'

const router = Router()

/**
 * GET /api/pdf/:id
 *
 * Looks up a previously generated PDF by UUID and sends it inline
 * (renders in the browser rather than triggering a download).
 * Returns 404 if the PDF has expired or never existed.
 */
router.get('/:id', (req, res) => {
  const pdf = getPdf(req.params.id)
  if (!pdf) {
    res.status(404).json({ error: 'PDF not found' })
    return
  }
  // Content-Disposition: inline so the browser shows the PDF directly
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${req.params.id}.pdf"`)
  res.send(pdf)
})

export default router
