import { type ReactElement } from 'react'

type Props = {
  chromaColor: string
  setChromaColor: (c: string) => void
  tolerance: number
  setTolerance: (n: number) => void
}

export default function Controls({ chromaColor, setChromaColor, tolerance, setTolerance }: Props) {
  return (
    <div className="mt-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-4 space-y-4 transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-800/20">
      <div className="space-y-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={chromaColor}
              onChange={(e) => setChromaColor(e.target.value)}
              className="w-12 h-8 rounded-md cursor-pointer border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
              title="Choose color to remove"
            />
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{chromaColor.toUpperCase()}</div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm items-center gap-2">
              <label className="font-medium text-gray-700 dark:text-gray-300">Tolerance</label>
              <input
                type="number"
                min={0}
                max={255}
                value={tolerance}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setTolerance(Math.min(255, Math.max(0, value)));
                }}
                className="w-20 px-2 py-1 border border-white/20 dark:border-white/10 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:border-purple-400/50 dark:focus:border-purple-500/50 transition-all duration-300 shadow-[0_4px_12px_0_rgba(31,38,135,0.15)]"
              />
            </div>
              <input
              type="range"
              min={0}
              max={255}
              value={tolerance}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTolerance(Math.min(255, Math.max(0, value)));
              }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
