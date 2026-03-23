/**
 * Rule-based syndrome → acupoint suggestion engine.
 *
 * Algorithm:
 *  1. Tokenise the user's query into lowercase words/phrases.
 *  2. For each SYNDROME_RULE, count how many of its keywords appear in the query.
 *  3. Rules with ≥1 match are collected; their recommended points are de-duplicated.
 *  4. Each matched point is returned with the consolidated reasoning and matched keywords.
 *
 * This deliberately stays simple (keyword overlap) so the code is transparent
 * and easy to swap for a vector-based or LLM approach in v2.
 */

import type { SuggestionResult } from '../types'
import { SYNDROME_RULES } from '../data/symptoms'
import { ACUPOINTS } from '../data/acupoints'

export function getSuggestions(query: string): SuggestionResult[] {
  if (!query.trim()) return []

  const normalised = query.toLowerCase()

  // Collect all matching rules
  const matchedRules = SYNDROME_RULES.filter(rule =>
    rule.keywords.some(kw => normalised.includes(kw))
  )

  if (matchedRules.length === 0) return []

  // Build a map: point_id → { reasoning[], matchedKeywords[], meridians[] }
  const pointMap = new Map<
    string,
    { reasoning: string[]; matchedKeywords: string[]; meridians: string[] }
  >()

  for (const rule of matchedRules) {
    const matched = rule.keywords.filter(kw => normalised.includes(kw))

    for (const pid of rule.points) {
      if (!pointMap.has(pid)) {
        pointMap.set(pid, { reasoning: [], matchedKeywords: [], meridians: [] })
      }
      const entry = pointMap.get(pid)!
      entry.reasoning.push(rule.reasoning)
      entry.matchedKeywords.push(...matched)
      for (const m of rule.meridians) {
        if (!entry.meridians.includes(m)) entry.meridians.push(m)
      }
    }
  }

  // Build final result array, looking up full Acupoint objects
  const results: SuggestionResult[] = []

  for (const [pid, meta] of pointMap.entries()) {
    const point = ACUPOINTS.find(a => a.point_id === pid)
    if (!point) continue

    results.push({
      point,
      reasoning: [...new Set(meta.reasoning)].join('\n\n'),
      matchedKeywords: [...new Set(meta.matchedKeywords)],
      meridians: meta.meridians,
    })
  }

  // Sort by number of unique matched keywords (most relevant first)
  results.sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length)

  return results
}
