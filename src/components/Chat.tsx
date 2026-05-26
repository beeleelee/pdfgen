import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef } from 'react'

interface ChatProps {
  onPdfUrl: (url: string | null) => void
  fileContent: string | null
}

export function Chat({ onPdfUrl, fileContent }: ChatProps) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const fileContentRef = useRef(fileContent)
  fileContentRef.current = fileContent

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last) return

    for (const part of last.parts) {
      if (part.type.startsWith('tool-') && 'state' in part) {
        const toolPart = part as {
          state: string
          output?: { pdfId?: string }
        }
        if (toolPart.state === 'output-available' && toolPart.output?.pdfId) {
          onPdfUrl(toolPart.output.pdfId)
          return
        }
      }
    }
  }, [messages, onPdfUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = inputRef.current?.value?.trim()
    if (!text || status !== 'ready') return

    const content = fileContentRef.current
      ? text + '\n\n---\n\n' + fileContentRef.current
      : text

    sendMessage({ text: content })
    if (inputRef.current) inputRef.current.value = ''
  }

  const statusText = status === 'submitted' ? 'Sending...'
    : status === 'streaming' ? 'Streaming...'
    : status === 'error' ? 'Error'
    : ''

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            <p className="text-xs font-semibold text-gray-500 mb-1">
              {msg.role === 'user' ? 'You' : 'AI'}
            </p>
            {msg.parts.map((part, i) => {
              if (part.type === 'text') {
                return <p key={i} className="whitespace-pre-wrap text-sm">{part.text}</p>
              }
              if (part.type.startsWith('tool-')) {
                return (
                  <p key={i} className="text-xs text-gray-400 italic">
                    [Tool call: {part.type}]
                  </p>
                )
              }
              return null
            })}
          </div>
        ))}
        {statusText && (
          <p className="text-xs text-gray-400 text-center">{statusText}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 text-center">
            Error: {error.message}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Describe the PDF you want to create..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            disabled={status !== 'ready'}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
