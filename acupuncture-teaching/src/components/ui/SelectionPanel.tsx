/**
 * SelectionPanel – shows full acupoint data when a point is clicked.
 *
 * Displayed on the right side of the screen.  Includes:
 *   - Point identity, meridian, region
 *   - Needle depth and angle notes
 *   - Full indications list
 *   - Contraindications (with warning styling)
 *   - Anatomy notes
 *   - Button to ask the AI assistant about this point
 */

import { X, AlertTriangle, BookOpen } from 'lucide-react'
import type { Acupoint } from '../../types'
import { MERIDIANS } from '../../data/meridians'

interface Props {
  point: Acupoint
  onClose: () => void
  onAskAI: (context: string) => void
}

export default function SelectionPanel({ point, onClose, onAskAI }: Props) {
  const meridian = MERIDIANS.find(m => m.code === point.meridian_code)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-start justify-between p-3 border-b border-gray-800 shrink-0"
        style={{ borderLeftColor: meridian?.color ?? '#f1c40f', borderLeftWidth: 3 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-lg">{point.point_id}</span>
            <span className="text-gray-400 text-sm">{point.chinese_name}</span>
          </div>
          <p className="text-white text-sm font-medium">{point.english_name}</p>
          <p className="text-gray-500 text-xs italic">{point.pinyin}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-4 text-xs">

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCell label="Meridian">
            <span style={{ color: meridian?.color ?? '#fff' }}>{point.meridian_name}</span>
          </InfoCell>
          <InfoCell label="Code">
            <span className="text-gray-300">{point.meridian_code}</span>
          </InfoCell>
          <InfoCell label="Region">
            <span className="text-gray-300 capitalize">{point.body_region}</span>
          </InfoCell>
          <InfoCell label="Side">
            <span className="text-gray-300 capitalize">{point.side}</span>
          </InfoCell>
          <InfoCell label="Needle Depth">
            <span className="text-green-400 font-medium">{point.needle_depth_mm} mm</span>
          </InfoCell>
        </div>

        {/* Angle notes */}
        <div>
          <Label>Insertion Notes</Label>
          <p className="text-gray-400 leading-relaxed">{point.angle_notes}</p>
        </div>

        {/* Indications */}
        <div>
          <Label>Indications</Label>
          <ul className="space-y-1">
            {point.indications.map((ind, i) => (
              <li key={i} className="flex items-start gap-1.5 text-gray-300">
                <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                {ind}
              </li>
            ))}
          </ul>
        </div>

        {/* Contraindications */}
        {point.contraindications.length > 0 && (
          <div className="bg-red-950 border border-red-800 rounded-md p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <Label className="text-red-400 mb-0">Contraindications</Label>
            </div>
            <ul className="space-y-1">
              {point.contraindications.map((c, i) => (
                <li key={i} className="text-red-300 leading-relaxed">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Anatomy notes */}
        <div>
          <Label>Anatomy Notes</Label>
          <p className="text-gray-400 leading-relaxed">{point.anatomy_notes}</p>
        </div>

        {/* Meridian description */}
        {meridian && (
          <div className="border-t border-gray-800 pt-3">
            <Label>Meridian Overview</Label>
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: meridian.color }}
              />
              <span className="text-gray-300">{meridian.name}</span>
              {meridian.element && (
                <span className="text-gray-600">· {meridian.element} Element</span>
              )}
            </div>
            <p className="text-gray-500 leading-relaxed">{meridian.description}</p>
          </div>
        )}

        {/* Ask AI button */}
        <button
          onClick={() =>
            onAskAI(
              `Tell me about the acupoint ${point.point_id} (${point.english_name}, ${point.chinese_name}). ` +
              `Why is it on the ${point.meridian_name}? What are the main indications and what TCM theory explains its use?`
            )
          }
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md
            bg-indigo-900 hover:bg-indigo-800 border border-indigo-700
            text-indigo-300 hover:text-white transition-colors text-xs font-medium"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Ask AI about {point.point_id}
        </button>
      </div>
    </div>
  )
}

// ── Small helper components ──────────────────────────────────────────

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded p-2">
      <p className="text-gray-600 mb-0.5">{label}</p>
      <div className="font-medium">{children}</div>
    </div>
  )
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-gray-500 font-semibold uppercase tracking-wide text-xs mb-1 ${className}`}>
      {children}
    </p>
  )
}
