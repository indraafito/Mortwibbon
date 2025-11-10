import React, { useRef, useState } from 'react'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import PreviewCanvas from './components/PreviewCanvas'
import Controls from './components/Controls'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

function App() {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null)
  const [overlaySrc, setOverlaySrc] = useState<string | null>(null)
  const [chromaColor, setChromaColor] = useState<string>('#00ff00')
  const [tolerance, setTolerance] = useState<number>(60)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-300 dark:from-purple-900 dark:via-blue-900 dark:to-purple-800 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 transition-all duration-300 relative">
          <div className="fixed inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-blue-400/30 backdrop-blur-3xl -z-10"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <Header />

          <main className="mt-4">
            <div className="grid gap-4 lg:grid-cols-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
                  <UploadSection
                    onBackground={setBackgroundSrc}
                    onOverlay={setOverlaySrc}
                  />
                </div>
                
                <div className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
                  <Controls
                    chromaColor={chromaColor}
                    setChromaColor={setChromaColor}
                    tolerance={tolerance}
                    setTolerance={setTolerance}
                  />
                </div>
              </div>

              <div className="lg:col-span-3 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
                <div className="max-w-[600px] w-full mx-auto">
                  <PreviewCanvas
                    ref={canvasRef}
                    backgroundSrc={backgroundSrc}
                    overlaySrc={overlaySrc}
                    chromaColor={chromaColor}
                    tolerance={tolerance}
                  />
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
            <p>Dibuat dengan ❤️ menggunakan React dan Tailwind CSS</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
