/**
 * AIAssistantPanel – educational AI chat panel powered by Anthropic claude-sonnet.
 *
 * The assistant is instructed to:
 *   1. Explain TCM concepts and acupoint theory in educational terms
 *   2. Never diagnose or prescribe
 *   3. Always frame responses as learning content
 *
 * Architecture:
 *   - Uses the Anthropic SDK (browser-compatible fetch transport)
 *   - Streams responses token-by-token via the streaming API
 *   - Maintains a short conversation history for follow-ups
 *   - The `initialContext` prop pre-populates the first user message
 *     (set by SelectionPanel and SyndromeSuggestion components)
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { Bot, Send, X, RefreshCw, AlertCircle } from 'lucide-react'
import type { AIMessage } from '../../types'

interface Props {
  initialContext?: string
  onClose: () => void
}

const SYSTEM_PROMPT = `You are an educational assistant teaching Traditional Chinese Medicine (TCM) acupuncture theory.
Your role is strictly educational — you explain concepts, history, and theory, but you do NOT:
- Provide medical diagnosis
- Recommend treatments for specific individuals
- Prescribe or suggest clinical protocols

When explaining acupoints:
- Describe their location in anatomical terms
- Explain the TCM theory (Qi, meridians, Zang-Fu) behind their use
- Connect Western anatomy to TCM concepts where helpful
- Use beginner-friendly language, but include correct terminology
- Note any classical references if relevant

Always include a brief reminder that this is for educational purposes only, not clinical advice.

Format your answers clearly with short paragraphs. Use plain text (no markdown headers).`

const STARTER_QUESTIONS = [
  'What is a meridian in TCM?',
  'What is the concept of Qi?',
  'What is De Qi sensation?',
  'How are acupoints located anatomically?',
  'What is the Five Element theory?',
]

export default function AIAssistantPanel({ initialContext, onClose }: Props) {
  const [messages, setMessages]   = useState<AIMessage[]>([])
  const [input, setInput]         = useState(initialContext ?? '')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [apiKey, setApiKey]       = useState(() => localStorage.getItem('tcm_ai_key') ?? '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLTextAreaElement>(null)
  const clientRef  = useRef<Anthropic | null>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // If an initial context was passed, send it automatically on mount
  useEffect(() => {
    if (initialContext?.trim()) {
      setInput(initialContext)
    }
  }, [initialContext])

  const getClient = useCallback(() => {
    if (!apiKey.trim()) return null
    if (!clientRef.current || (clientRef.current as any)._options?.apiKey !== apiKey) {
      clientRef.current = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      })
    }
    return clientRef.current
  }, [apiKey])

  const saveKey = () => {
    localStorage.setItem('tcm_ai_key', apiKey)
    setShowKeyInput(false)
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    setError(null)

    const client = getClient()
    if (!client) {
      setError('Please enter your Anthropic API key to use the AI assistant.')
      setShowKeyInput(true)
      return
    }

    const userMsg: AIMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    // Add placeholder assistant message for streaming
    const assistantMsg: AIMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: nextMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      })

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          const textChunk = (chunk.delta as { type: 'text_delta'; text: string }).text
          setMessages(prev => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + textChunk,
              }
            }
            return updated
          })
        }
      }
    } catch (e: any) {
      setError(e?.message ?? 'An error occurred. Check your API key and try again.')
      // Remove the empty assistant placeholder
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1))
    } finally {
      setLoading(false)
    }
  }, [messages, loading, getClient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const reset = () => {
    setMessages([])
    setInput('')
    setError(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-white">AI Teaching Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={reset}
            title="Clear conversation"
            className="text-gray-500 hover:text-white transition-colors p-1 rounded"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowKeyInput(v => !v)}
            title="API Key settings"
            className="text-gray-500 hover:text-white transition-colors p-1 rounded text-xs"
          >
            Key
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <div className="p-3 bg-gray-950 border-b border-gray-800 shrink-0">
          <p className="text-xs text-gray-500 mb-2">
            Enter your Anthropic API key. It is stored only in localStorage.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1
                text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={saveKey}
              className="bg-indigo-700 hover:bg-indigo-600 text-white text-xs rounded px-2 py-1"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-3 py-2 bg-amber-950/50 border-b border-amber-900/50 shrink-0">
        <p className="text-xs text-amber-600">
          Educational use only. AI responses are not medical advice.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              Ask me anything about TCM theory, meridians, or acupoints.
            </p>
            <div className="flex flex-col gap-1.5">
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700
                    hover:border-gray-600 rounded-md px-2.5 py-1.5 text-gray-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-900 border border-indigo-700 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-300'
              }`}
            >
              {msg.content || (
                <span className="text-gray-600 italic">Thinking…</span>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="flex items-start gap-2 bg-red-950 border border-red-800 rounded-md p-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about TCM theory… (Enter to send)"
            rows={2}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5
              text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500
              resize-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
              text-white rounded-md p-2 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  )
}
