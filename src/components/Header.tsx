import { NavLink } from 'react-router-dom'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

export default function Header() {
  const [dark, setDark] = useLocalStorageState('pct.darkMode', false)

  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-800 dark:via-purple-900 dark:to-indigo-900 shadow-lg animated-gradient">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-1.5 text-2xl select-none">
            <span aria-hidden="true">🃏</span>
            <span aria-hidden="true" className="text-lg">⚔️</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-extrabold text-lg leading-tight tracking-tight">
              Card Tracker
            </span>
            <span className="block text-indigo-200 text-xs font-medium -mt-0.5">
              Pokémon & One Piece TCG
            </span>
          </div>
          <span className="text-white font-bold text-base leading-tight sm:hidden">
            CT
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <button
            onClick={() => setDark((d) => !d)}
            className="ml-2 p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  )
}
