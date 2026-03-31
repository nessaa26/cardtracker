import { NavLink } from 'react-router-dom'
import { useLocalStorageState } from '../hooks/useLocalStorageState'

export default function Header() {
  const [dark, setDark] = useLocalStorageState('pct.darkMode', false)

  // Apply dark mode class to <html>
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
    }`

  return (
    <header className="bg-indigo-600 dark:bg-indigo-800 shadow">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none" aria-hidden="true">🃏</span>
          <span className="text-white font-bold text-lg leading-tight hidden sm:block">
            Pokémon Card Tracker
          </span>
          <span className="text-white font-bold text-base leading-tight sm:hidden">
            PCT
          </span>
        </div>

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
            className="ml-2 p-2 rounded-md text-indigo-100 hover:bg-indigo-700 transition-colors"
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
