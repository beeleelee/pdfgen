import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileContent: (content: string | null) => void
}

export function FileUpload({ onFileContent }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [filename, setFilename] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      onFileContent(text)
      setFilename(file.name)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    onFileContent(null)
    setFilename(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors text-sm ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md"
          onChange={handleChange}
          className="hidden"
        />
        {filename ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-700 truncate">{filename}</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <p className="text-gray-500">
            Drop a .txt or .md file here, or click to browse
          </p>
        )}
      </div>
    </div>
  )
}
