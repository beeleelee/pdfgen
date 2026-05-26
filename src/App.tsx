import { useState } from 'react'
import { Chat } from './components/Chat'
import { FileUpload } from './components/FileUpload'
import { PdfPreview } from './components/PdfPreview'
import { Controls } from './components/Controls'

export default function App() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        <FileUpload onFileContent={setFileContent} />
        <Chat onPdfUrl={setPdfUrl} fileContent={fileContent} />
      </div>
      <div className="w-1/2 flex flex-col">
        <Controls pdfUrl={pdfUrl} onClear={() => setPdfUrl(null)} />
        <PdfPreview pdfUrl={pdfUrl} />
      </div>
    </div>
  )
}
