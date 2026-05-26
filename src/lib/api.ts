export async function fetchPdf(id: string): Promise<Blob> {
  const res = await fetch(`/api/pdf/${id}`)
  if (!res.ok) throw new Error('Failed to fetch PDF')
  return res.blob()
}

export async function downloadPdf(id: string): Promise<void> {
  const blob = await fetchPdf(id)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${id}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
