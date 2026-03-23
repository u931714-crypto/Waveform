/**
 * MeridianFilter – buttons to show/hide individual meridians.
 *
 * "All" and "None" buttons for bulk operations.
 * Individual meridian buttons toggle inclusion in the activeMeridians set.
 * When activeMeridians is empty the renderer shows all meridians.
 */

import { MERIDIANS } from '../../data/meridians'

interface Props {
  activeMeridians: Set<string>
  onChange: (updated: Set<string>) => void
}

export default function MeridianFilter({ activeMeridians, onChange }: Props) {
  const allVisible = activeMeridians.size === 0

  const handleAll = () => onChange(new Set())

  const handleNone = () => {
    // Pass a sentinel value that hides everything; use a non-existent code.
    onChange(new Set(['__none__']))
  }

  const toggle = (code: string) => {
    const next = new Set(activeMeridians)
    // If currently "all", switch to showing only this one
    if (allVisible) {
      onChange(new Set([code]))
      return
    }
    // Remove the sentinel if present
    next.delete('__none__')
    if (next.has(code)) {
      next.delete(code)
      // If nothing left, go back to "all"
      if (next.size === 0) { onChange(new Set()); return }
    } else {
      next.add(code)
    }
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1 px-1">
        Meridians
      </h2>

      {/* Bulk actions */}
      <div className="flex gap-1 mb-1">
        <button
          onClick={handleAll}
          className={`flex-1 text-xs py-1 rounded transition-colors ${
            allVisible
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={handleNone}
          className={`flex-1 text-xs py-1 rounded transition-colors ${
            activeMeridians.has('__none__')
              ? 'bg-gray-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          None
        </button>
      </div>

      {/* Per-meridian toggles */}
      {MERIDIANS.map(m => {
        const isActive = allVisible || activeMeridians.has(m.code)
        return (
          <button
            key={m.code}
            onClick={() => toggle(m.code)}
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full
              transition-colors duration-150 cursor-pointer
              ${isActive
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
              }
            `}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: m.color, opacity: isActive ? 1 : 0.35 }}
            />
            <span className="flex-1 text-left">{m.code}</span>
            <span className="text-gray-500 text-right truncate max-w-[80px] hidden xl:block">
              {m.name.replace(' Meridian', '').replace(' Vessel', '')}
            </span>
          </button>
        )
      })}
    </div>
  )
}
