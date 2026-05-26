import { useState } from 'react'

interface PdfPreviewProps {
  pdfUrl: string | null
}

export function PdfPreview({ pdfUrl }: PdfPreviewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Your PDF will appear here
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <p className="text-sm text-gray-500">Loading PDF...</p>
        </div>
      )}
      {error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
          Failed to load PDF
        </div>
      ) : (
        <iframe
          src={`/api/pdf/${pdfUrl}`}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true) }}
        />
      )}
    </div>
  )
}
