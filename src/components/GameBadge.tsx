import type { CardGame } from '../types'

const GAME_CONFIG: Record<CardGame, { label: string; emoji: string; className: string }> = {
  pokemon: {
    label: 'Pokémon',
    emoji: '⚡',
    className: 'game-badge-pokemon',
  },
  one_piece: {
    label: 'One Piece',
    emoji: '☠️',
    className: 'game-badge-one-piece',
  },
}

interface GameBadgeProps {
  game: CardGame
  size?: 'sm' | 'md'
}

export default function GameBadge({ game, size = 'sm' }: GameBadgeProps) {
  const config = GAME_CONFIG[game]
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold whitespace-nowrap shadow-sm ${sizeClass} ${config.className}`}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  )
}

export { GAME_CONFIG }
