import React from 'react'

type Props = {
  onBackground: (dataUrl: string | null) => void
  onOverlay: (dataUrl: string | null) => void
}

export default function UploadSection({ onBackground, onOverlay }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, cb: (d: string | null) => void) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return cb(null)
    const reader = new FileReader()
    reader.onload = () => cb(reader.result as string)
    reader.readAsDataURL(f)
  }

  return (
    <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 dark:border-white/10 p-4 space-y-3 transition-all duration-300 ease-in-out hover:bg-white/20 dark:hover:bg-gray-800/20">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">Upload Images</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Twibbon
          </label>
          <div className="flex justify-center px-4 py-3 border-2 border-white/30 dark:border-white/10 border-dashed rounded-lg hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all bg-white/5 dark:bg-gray-800/5 backdrop-blur-lg">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 focus-within:outline-none">
                  <span>Choose file</span>
                  <input 
                    type="file"
                    className="sr-only"
                    accept="image/png"
                    onChange={(e) => handleFile(e, onOverlay)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Photo
          </label>
          <div className="flex justify-center px-4 py-3 border-2 border-white/30 dark:border-white/10 border-dashed rounded-lg hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all bg-white/5 dark:bg-gray-800/5 backdrop-blur-lg">
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-1" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 focus-within:outline-none">
                  <span>Choose file</span>
                  <input 
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFile(e, onBackground)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
