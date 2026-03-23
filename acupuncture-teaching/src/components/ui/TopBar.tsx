/**
 * TopBar – project title, subtitle, and educational disclaimer.
 */

import { AlertTriangle } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800 shrink-0 z-20">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-gray-900">
          針
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white leading-none">
            TCM Acupuncture Teaching System
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Interactive 3D Educational Visualization</p>
        </div>
      </div>

      {/* Disclaimer badge */}
      <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-700 rounded-md px-3 py-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300 font-medium">
          Educational Use Only — Not a medical diagnosis tool
        </span>
      </div>
    </header>
  )
}
