import { useState } from 'react'
import { Chat } from './components/Chat'
import { FileUpload } from './components/FileUpload'

export default function App() {
  const [fileContent, setFileContent] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="font-semibold text-gray-800">pdfgen</span>
          <FileUpload onFileContent={setFileContent} />
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <div className="h-full max-w-3xl mx-auto px-4 py-4">
          <Chat fileContent={fileContent} />
        </div>
      </main>
    </div>
  )
}
