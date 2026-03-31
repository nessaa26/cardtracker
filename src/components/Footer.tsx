export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/60 dark:border-gray-700/60 py-5">
      <div className="container mx-auto px-4 max-w-7xl text-center text-sm text-gray-500 dark:text-gray-400 space-y-1.5">
        <p>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Card Tracker</span> &mdash; Community data, for reference only.{' '}
          <span className="italic">Verify availability directly with retailers.</span>
        </p>
        <p className="text-xs">
          Pokémon and all related names are trademarks of Nintendo / Creatures Inc. / GAME FREAK inc.
          One Piece Card Game is a trademark of Bandai Co., Ltd.
        </p>
      </div>
    </footer>
  )
}
