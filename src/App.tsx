import { useState, useRef, type DragEvent } from 'react'
import { Chat } from './components/Chat'

export default function App() {
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCount = useRef(0)

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) return
    const reader = new FileReader()
    reader.onload = () => {
      setFileContent(reader.result as string)
      setFilename(file.name)
    }
    reader.readAsText(file)
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    dragCount.current++
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    dragCount.current--
    if (dragCount.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    dragCount.current = 0
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <p className="text-lg text-gray-600 font-medium">
            Drop .txt or .md file here
          </p>
        </div>
      )}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-semibold text-gray-800">pdfgen</span>
          {filename && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 truncate max-w-28">
                {filename}
              </span>
              <button
                onClick={() => { setFileContent(null); setFilename(null) }}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <div className="h-full max-w-3xl mx-auto px-4 py-4 flex flex-col min-h-0">
          <Chat fileContent={fileContent} />
        </div>
      </main>
    </div>
  )
}
