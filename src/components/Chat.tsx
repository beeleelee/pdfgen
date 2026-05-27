import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, type KeyboardEvent } from 'react'

interface ChatProps {
  fileContent: string | null
}

export function Chat({ fileContent }: ChatProps) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileContentRef = useRef(fileContent)
  fileContentRef.current = fileContent

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

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
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            Start typing to create a PDF...
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.parts.map((part, i) => {
                if (part.type === 'text') {
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-100 ml-8'
                          : 'bg-gray-100 mr-8'
                      }`}
                    >
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        {msg.role === 'user' ? 'You' : 'AI'}
                      </p>
                      <p className="whitespace-pre-wrap text-sm">{part.text}</p>
                    </div>
                  )
                }
                if (part.type.startsWith('tool-')) {
                  const toolPart = part as { state?: string; output?: { pdfId?: string } }
                  if (toolPart.state === 'output-available' && toolPart.output?.pdfId) {
                    return (
                      <a
                        key={i}
                        href={`/api/pdf/${toolPart.output.pdfId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 ml-8"
                      >
                        Open PDF ↗
                      </a>
                    )
                  }
                  return (
                    <div key={i} className="p-3 ml-8">
                      <p className="text-xs text-gray-400 italic">Generating PDF...</p>
                    </div>
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
      )}

      <form onSubmit={handleSubmit} className="pt-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            rows={3}
            placeholder="Describe the PDF you want to create..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={status !== 'ready'}
            onKeyDown={handleKeyDown}
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
