import { downloadPdf } from '../lib/api'

interface ControlsProps {
  pdfUrl: string | null
  onClear: () => void
}

export function Controls({ pdfUrl, onClear }: ControlsProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-700">PDF Preview</span>
      <div className="flex-1" />
      <button
        onClick={() => pdfUrl && downloadPdf(pdfUrl)}
        disabled={!pdfUrl}
        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Download
      </button>
      <button
        onClick={onClear}
        disabled={!pdfUrl}
        className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  )
}
