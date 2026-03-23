/**
 * LayerController – toggle buttons for each anatomy/visualization layer.
 *
 * Renders a vertical list of toggle chips.  Each chip shows the layer name,
 * a colour swatch, and a toggle switch.  Toggling calls back to the parent.
 */

import { Eye, EyeOff } from 'lucide-react'
import { ANATOMY_LAYERS } from '../../data/layers'
import type { LayerVisibility } from '../../types'

interface Props {
  visibility: LayerVisibility
  onChange: (key: string, value: boolean) => void
}

export default function LayerController({ visibility, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1 px-1">
        Anatomy Layers
      </h2>

      {ANATOMY_LAYERS.map(layer => {
        const isOn = visibility[layer.key] !== false
        return (
          <button
            key={layer.key}
            onClick={() => onChange(layer.key, !isOn)}
            title={layer.description}
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full
              transition-colors duration-150 cursor-pointer
              ${isOn
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
              }
            `}
          >
            {/* Colour swatch */}
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: layer.color, opacity: isOn ? 1 : 0.35 }}
            />

            {/* Label */}
            <span className="flex-1 text-left">{layer.label}</span>

            {/* Eye icon */}
            {isOn
              ? <Eye className="w-3 h-3 text-gray-400 shrink-0" />
              : <EyeOff className="w-3 h-3 text-gray-600 shrink-0" />
            }
          </button>
        )
      })}
    </div>
  )
}
