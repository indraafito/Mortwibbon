import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <header className="relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-3">
            <img className="w-16 h-16 object-contain my-auto" src={new URL('../../src/assets/twibbon.png', import.meta.url).href} alt="Twibbon Icon" />
            <span className="bg-gradient-to-r from-[#6649A1] to-purple-400 text-transparent bg-clip-text my-auto">
              Mortwibbon
            </span>
          </h1>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-4">
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/50 dark:border-gray-600/50 transition-all duration-300 focus:outline-none cursor-pointer hover:bg-white/70 dark:hover:bg-gray-700/70 p-1"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="sr-only">Toggle theme</span>
            <div
              className={`${
                isDark ? 'translate-x-6 bg-purple-500' : 'translate-x-0 bg-white'
              } inline-block h-6 w-6 transform rounded-full transition-transform duration-300 shadow-md cursor-pointer`}
            >
              <div className="h-full w-full relative flex items-center justify-center">
                {isDark ? (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
            </div>
          </button>
          <a
            href="https://github.com/indraafito/Mortwibbon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-600/50 rounded-md shadow-sm hover:bg-white/70 dark:hover:bg-gray-700/70 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -translate-y-4 translate-x-4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
    </header>
  )
}
