import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileContent: (content: string | null) => void
}

export function FileUpload({ onFileContent }: FileUploadProps) {
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
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md"
        onChange={handleChange}
        className="hidden"
      />
      {filename ? (
        <>
          <span className="text-xs text-gray-600 truncate max-w-28">
            {filename}
          </span>
          <button
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            ✕
          </button>
        </>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          + Attach
        </button>
      )}
    </div>
  )
}
