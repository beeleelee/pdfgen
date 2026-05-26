export async function fetchPdf(id: string): Promise<Blob> {
  const res = await fetch(`/api/pdf/${id}`)
  if (!res.ok) throw new Error('Failed to fetch PDF')
  return res.blob()
}
