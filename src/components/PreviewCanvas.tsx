import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

type Props = {
  backgroundSrc: string | null
  overlaySrc: string | null
  chromaColor: string
  tolerance: number
}

const PreviewCanvas = forwardRef<HTMLCanvasElement, Props>(function PreviewCanvas({ backgroundSrc, overlaySrc, chromaColor, tolerance }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

  const [bgImg, setBgImg] = useState<HTMLImageElement | null>(null)
  const [ovImg, setOvImg] = useState<HTMLImageElement | null>(null)
  const [processedOv, setProcessedOv] = useState<HTMLCanvasElement | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'))

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // pan/zoom state
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!backgroundSrc) return setBgImg(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = backgroundSrc
    img.onload = () => setBgImg(img)
  }, [backgroundSrc])

  useEffect(() => {
    if (!overlaySrc) return setOvImg(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = overlaySrc
    img.onload = () => setOvImg(img)
  }, [overlaySrc])

  // process overlay (chroma key) whenever overlay, chromaColor, tolerance change
  useEffect(() => {
    if (!ovImg) return setProcessedOv(null)
    const c = document.createElement('canvas')
    c.width = ovImg.width
    c.height = ovImg.height
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(ovImg, 0, 0)
    const data = ctx.getImageData(0, 0, c.width, c.height)
    const key = hexToRgb(chromaColor)
    if (!key) return setProcessedOv(c)
    for (let i = 0; i < data.data.length; i += 4) {
      const r = data.data[i]
      const g = data.data[i + 1]
      const b = data.data[i + 2]
      const dist = colorDistance({ r, g, b }, key)
      if (dist <= tolerance) {
        // make transparent
        data.data[i + 3] = 0
      }
    }
    ctx.putImageData(data, 0, 0)
    setProcessedOv(c)
  }, [ovImg, chromaColor, tolerance])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1
    
    // Set ukuran tetap untuk preview
    const width = 600
    const height = 600
    
    // Set ukuran canvas
    canvas.width = width * DPR
    canvas.height = height * DPR
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    // draw background and overlay centered
    ctx.clearRect(0, 0, width, height)

    if (bgImg) {
      // draw background with scale and offset
      const bw = bgImg.width
      const bh = bgImg.height
      
      // Fit background to canvas exactly
      const baseScale = Math.min(
        width / bw,  // scale to fit width
        height / bh  // scale to fit height
      )
      
      // Calculate centered position
      const drawW = bw * baseScale * scale
      const drawH = bh * baseScale * scale
      const dx = (width - drawW) / 2 + offset.x
      const dy = (height - drawH) / 2 + offset.y
      
      ctx.drawImage(bgImg, dx, dy, drawW, drawH)
    } else {
      // placeholder
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f3f4f6'
      ctx.fillRect(0, 0, width, height)
    }

    if (processedOv) {
      // draw overlay centered and scaled to canvas
      const ow = processedOv.width
      const oh = processedOv.height
      const scaleOv = Math.max(width / ow, height / oh)
      const owW = ow * scaleOv
      const owH = oh * scaleOv
      const odx = (width - owW) / 2
      const ody = (height - owH) / 2
      
      // Adjust background image scale and position to match overlay
      if (bgImg && !dragging.current) {
        const bw = bgImg.width
        const bh = bgImg.height
        // Calculate scale to fit background to overlay
        const fitScale = Math.max(owW / bw, owH / bh)
        setScale(fitScale / Math.max(width / bw, height / bh))
        // Center background to overlay
        setOffset({
          x: odx - (width - bw * fitScale) / 2,
          y: ody - (height - bh * fitScale) / 2
        })
      }

      ctx.drawImage(processedOv, odx, ody, owW, owH)
    }
  }, [bgImg, processedOv, offset, scale, isDarkMode])

  // pointer handlers for pan
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setOffset((p) => ({ x: p.x + dx, y: p.y + dy }))
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    setScale((s) => Math.max(0.2, Math.min(4, s + delta)))
  }

  function downloadCanvas(canvas: HTMLCanvasElement, name = 'twibbon.png') {
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-4 relative transition-all duration-300 transform hover:bg-white/20 dark:hover:bg-gray-800/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          Preview
        </h3>
        <div className="flex items-center gap-3">
          <button
            className="text-xs bg-purple-500/80 backdrop-blur-md text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-all hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_0_rgba(147,51,234,0.3)] disabled:hover:bg-purple-600/80"
            onClick={() => {
              if (!canvasRef.current) return
              downloadCanvas(canvasRef.current)
            }}
            disabled={!backgroundSrc && !overlaySrc}
            title="Download PNG"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
            onClick={() => {
              setScale(1)
              setOffset({ x: 0, y: 0 })
            }}
            title="Reset position and zoom"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
            </svg>
            Reset
          </button>
          <div title="Drag to move, scroll to zoom" className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>
      </div>
      
      <div 
        className="relative rounded-lg overflow-hidden bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl border border-white/20 dark:border-white/10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{ touchAction: 'none' }}
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '600px', height: '600px' }}
        />
        {!backgroundSrc && !overlaySrc && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <p>Upload images to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default PreviewCanvas

// helpers
function hexToRgb(hex: string | null) {
  if (!hex) return null
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16)
    }
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16)
    }
  }
  return null
}

function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  // Euclidean distance
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}
