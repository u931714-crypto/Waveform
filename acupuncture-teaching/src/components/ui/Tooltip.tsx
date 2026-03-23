/**
 * Tooltip – 2D HTML overlay shown when hovering an acupoint in the 3D scene.
 *
 * Positioned absolutely in screen space using projected 3D coordinates.
 * Automatically flips left/right to stay within viewport bounds.
 */

import type { Acupoint } from '../../types'

interface Props {
  point: Acupoint
  screenX: number
  screenY: number
}

export default function Tooltip({ point, screenX, screenY }: Props) {
  // Decide whether to render left or right of the cursor
  const flipLeft = screenX > window.innerWidth * 0.65

  return (
    <div
      className="tooltip-enter pointer-events-none fixed z-50 w-52"
      style={{
        left: flipLeft ? screenX - 220 : screenX + 14,
        top: Math.max(8, screenY - 40),
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-2xl text-xs">
        {/* Point code + Chinese name */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-yellow-400 text-sm">{point.point_id}</span>
          <span className="text-gray-400">{point.chinese_name}</span>
        </div>

        {/* English name */}
        <p className="text-white font-medium mb-1">{point.english_name}</p>
        <p className="text-gray-500 mb-2 italic text-xs">{point.pinyin}</p>

        {/* Meridian */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-gray-500">Meridian:</span>
          <span className="text-blue-400">{point.meridian_name}</span>
        </div>

        {/* Needle depth */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-gray-500">Depth:</span>
          <span className="text-green-400">{point.needle_depth_mm} mm</span>
        </div>

        {/* Top indication */}
        {point.indications[0] && (
          <div className="border-t border-gray-700 pt-1.5">
            <span className="text-gray-500">Indication: </span>
            <span className="text-gray-300">{point.indications[0]}</span>
          </div>
        )}

        <p className="text-gray-600 mt-1.5 text-xs">Click for full details →</p>
      </div>
    </div>
  )
}
