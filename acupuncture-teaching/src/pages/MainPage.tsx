/**
 * MainPage – root layout component.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │  TopBar                                                      │
 *   ├──────────┬───────────────────────────────┬───────────────────┤
 *   │ Left     │                               │  Right panel      │
 *   │ panel    │   3D scene (HumanModelScene)  │  (tabs):          │
 *   │          │                               │  - Point detail   │
 *   │ Layers   │                               │  - Syndrome input │
 *   │ Meridian │                               │  - AI Assistant   │
 *   │ filters  │                               │                   │
 *   └──────────┴───────────────────────────────┴───────────────────┘
 *
 * All application state lives here so sibling panels can react to
 * 3D interactions and vice versa.
 */

import { useState, useCallback } from 'react'
import TopBar from '../components/ui/TopBar'
import LayerController from '../components/ui/LayerController'
import MeridianFilter from '../components/ui/MeridianFilter'
import SelectionPanel from '../components/ui/SelectionPanel'
import SyndromeSuggestion from '../components/ui/SyndromeSuggestion'
import AIAssistantPanel from '../components/ui/AIAssistantPanel'
import Tooltip from '../components/ui/Tooltip'
import HumanModelScene from '../components/scene/HumanModelScene'

import type { Acupoint, LayerVisibility, SuggestionResult } from '../types'
import { ANATOMY_LAYERS } from '../data/layers'
import { ACUPOINTS } from '../data/acupoints'

// ── Build default visibility from layer definitions ──────────────
function defaultVisibility(): LayerVisibility {
  const v: LayerVisibility = {}
  for (const l of ANATOMY_LAYERS) v[l.key] = l.defaultVisible
  return v
}

// ── Right panel tab type ─────────────────────────────────────────
type RightTab = 'detail' | 'syndrome' | 'ai'

export default function MainPage() {
  // Layer visibility
  const [layers, setLayers] = useState<LayerVisibility>(defaultVisibility)

  // Meridian filter
  const [activeMeridians, setActiveMeridians] = useState<Set<string>>(new Set())

  // Acupoint selection + hover
  const [selectedPoint, setSelectedPoint] = useState<Acupoint | null>(null)
  const [hoveredPoint,  setHoveredPoint]  = useState<Acupoint | null>(null)
  const [tooltipPos,    setTooltipPos]    = useState({ x: 0, y: 0 })

  // Syndrome suggestions
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([])
  const suggestedIds = new Set(suggestions.map(s => s.point.point_id))

  // Right panel tab
  const [rightTab, setRightTab] = useState<RightTab>('syndrome')

  // AI context (what the AI should address)
  const [aiContext, setAiContext] = useState('')

  // ── Layer toggle handler ──────────────────────────────────────
  const handleLayerChange = useCallback((key: string, value: boolean) => {
    setLayers(prev => ({ ...prev, [key]: value }))
  }, [])

  // ── Hover callback from 3D scene ──────────────────────────────
  const handleHover = useCallback(
    (point: Acupoint | null, screenPos: { x: number; y: number }) => {
      setHoveredPoint(point)
      setTooltipPos(screenPos)
    },
    []
  )

  // ── Select callback from 3D scene ─────────────────────────────
  const handleSelect = useCallback((point: Acupoint) => {
    setSelectedPoint(point)
    setRightTab('detail')
  }, [])

  // ── Select point from syndrome suggestion list ─────────────────
  const handleSelectById = useCallback((id: string) => {
    const p = ACUPOINTS.find(a => a.point_id === id)
    if (p) { setSelectedPoint(p); setRightTab('detail') }
  }, [])

  // ── Open AI with pre-set context ──────────────────────────────
  const handleAskAI = useCallback((context: string) => {
    setAiContext(context)
    setRightTab('ai')
  }, [])

  // ── Tab label helpers ─────────────────────────────────────────
  const tabCls = (tab: RightTab) =>
    `flex-1 py-1.5 text-xs font-medium transition-colors rounded-t ${
      rightTab === tab
        ? 'bg-gray-800 text-white'
        : 'bg-gray-900 text-gray-500 hover:text-gray-300'
    }`

  return (
    <div className="flex flex-col w-full h-full bg-gray-950 text-white overflow-hidden">
      {/* Top bar */}
      <TopBar />

      {/* Main content */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left panel ──────────────────────────────────────── */}
        <aside className="w-48 shrink-0 bg-gray-950 border-r border-gray-800
          flex flex-col gap-4 p-3 overflow-y-auto panel-scroll">
          <LayerController
            visibility={layers}
            onChange={handleLayerChange}
          />
          <hr className="border-gray-800" />
          <MeridianFilter
            activeMeridians={activeMeridians}
            onChange={setActiveMeridians}
          />
        </aside>

        {/* ── 3D Scene (centre) ────────────────────────────────── */}
        <main className="flex-1 relative bg-gradient-to-b from-gray-900 to-gray-950 min-w-0">
          <HumanModelScene
            layers={layers}
            activeMeridians={activeMeridians}
            selectedId={selectedPoint?.point_id ?? null}
            suggestedIds={suggestedIds}
            onHover={handleHover}
            onSelect={handleSelect}
          />

          {/* Hover tooltip (2D overlay) */}
          {hoveredPoint && (
            <Tooltip
              point={hoveredPoint}
              screenX={tooltipPos.x}
              screenY={tooltipPos.y}
            />
          )}

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <LegendBadge color="#f1c40f" label="Acupoint" />
            <LegendBadge color="#00d4ff" label="Selected" />
            <LegendBadge color="#ff6b6b" label="Suggested" />
          </div>

          {/* Controls hint */}
          <p className="absolute bottom-3 right-3 text-xs text-gray-600">
            Drag to rotate · Scroll to zoom · Click point for details
          </p>
        </main>

        {/* ── Right panel ─────────────────────────────────────── */}
        <aside className="w-72 shrink-0 bg-gray-950 border-l border-gray-800
          flex flex-col min-h-0">

          {/* Tab bar */}
          <div className="flex gap-0.5 p-1 bg-gray-900 border-b border-gray-800 shrink-0">
            <button className={tabCls('detail')}   onClick={() => setRightTab('detail')}>
              Point
            </button>
            <button className={tabCls('syndrome')} onClick={() => setRightTab('syndrome')}>
              Symptoms
            </button>
            <button className={tabCls('ai')}       onClick={() => setRightTab('ai')}>
              AI Tutor
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {rightTab === 'detail' && selectedPoint ? (
              <SelectionPanel
                point={selectedPoint}
                onClose={() => setSelectedPoint(null)}
                onAskAI={handleAskAI}
              />
            ) : rightTab === 'detail' && !selectedPoint ? (
              <EmptyDetailState />
            ) : null}

            {rightTab === 'syndrome' && (
              <div className="h-full overflow-y-auto panel-scroll p-3">
                <SyndromeSuggestion
                  onSuggest={setSuggestions}
                  onSelectPoint={handleSelectById}
                  onAskAI={handleAskAI}
                />
              </div>
            )}

            {rightTab === 'ai' && (
              <AIAssistantPanel
                key={aiContext}   // re-mount when context changes so input is pre-filled
                initialContext={aiContext}
                onClose={() => setRightTab('syndrome')}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────

function EmptyDetailState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
        針
      </div>
      <p className="text-gray-400 text-sm font-medium">No point selected</p>
      <p className="text-gray-600 text-xs">
        Hover over a yellow marker in the 3D view and click to see full point details.
      </p>
    </div>
  )
}

function LegendBadge({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-gray-950/80 rounded px-2 py-1">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
