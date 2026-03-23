/**
 * SyndromeSuggestion – symptom / syndrome input + rule-based result list.
 *
 * The user types a symptom description; the engine returns relevant acupoints
 * which are listed here and highlighted on the 3D body.
 */

import { useState, useCallback } from 'react'
import { Search, X, Zap } from 'lucide-react'
import { getSuggestions } from '../../engine/syndromeSuggestion'
import type { SuggestionResult } from '../../types'
import { MERIDIANS } from '../../data/meridians'

interface Props {
  onSuggest: (results: SuggestionResult[]) => void
  onSelectPoint: (pointId: string) => void
  onAskAI: (context: string) => void
}

const EXAMPLE_QUERIES = [
  'headache', 'insomnia', 'stress', 'digestive', 'fatigue', 'neck stiffness'
]

export default function SyndromeSuggestion({ onSuggest, onSelectPoint, onAskAI }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<SuggestionResult[]>([])
  const [searched, setSearched] = useState(false)

  const runSearch = useCallback((q: string) => {
    const res = getSuggestions(q)
    setResults(res)
    setSearched(true)
    onSuggest(res)
  }, [onSuggest])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) runSearch(query)
  }

  const clear = () => {
    setQuery('')
    setResults([])
    setSearched(false)
    onSuggest([])
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 px-1">
        Syndrome / Symptom Lookup
      </h2>

      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. headache, insomnia..."
            className="w-full bg-gray-900 border border-gray-700 rounded-md py-1.5 pl-7 pr-2
              text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-600 text-white rounded-md px-2.5 text-xs
            transition-colors font-medium"
        >
          Go
        </button>
        {searched && (
          <button type="button" onClick={clear}
            className="text-gray-500 hover:text-white transition-colors px-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Example chips */}
      {!searched && (
        <div className="flex flex-wrap gap-1">
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); runSearch(q) }}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white
                rounded px-2 py-0.5 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {searched && results.length === 0 && (
        <p className="text-xs text-gray-500 italic px-1">
          No matching acupoints found. Try different terms.
        </p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 px-1">
            {results.length} point{results.length !== 1 ? 's' : ''} suggested
          </p>

          {results.map(r => {
            const mer = MERIDIANS.find(m => m.code === r.point.meridian_code)
            return (
              <div
                key={r.point.point_id}
                className="bg-gray-900 border border-gray-700 rounded-md p-2.5
                  hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => onSelectPoint(r.point.point_id)}
              >
                {/* Point header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 font-bold text-sm">{r.point.point_id}</span>
                  <span className="text-gray-400 text-xs">{r.point.chinese_name}</span>
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: (mer?.color ?? '#666') + '33',
                      color: mer?.color ?? '#aaa',
                    }}
                  >
                    {r.point.meridian_code}
                  </span>
                </div>

                {/* English name */}
                <p className="text-white text-xs mb-1.5">{r.point.english_name}</p>

                {/* Matched keywords */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {r.matchedKeywords.slice(0, 3).map(kw => (
                    <span key={kw}
                      className="bg-blue-900 text-blue-300 text-xs rounded px-1.5 py-0.5"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Reasoning preview */}
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                  {r.reasoning.split('\n\n')[0]}
                </p>

                {/* Ask AI */}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onAskAI(
                      `Why is ${r.point.point_id} (${r.point.english_name}) recommended for "${query}"? ` +
                      `Explain the TCM reasoning in educational terms.`
                    )
                  }}
                  className="mt-2 flex items-center gap-1 text-xs text-indigo-400
                    hover:text-indigo-200 transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  Explain with AI
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
