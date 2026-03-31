export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 max-w-7xl text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Pokémon Card Availability Tracker &mdash; Community data, for reference only.{' '}
          <span className="italic">Verify availability directly with retailers.</span>
        </p>
        <p className="mt-1">
          Pokémon and all related names are trademarks of Nintendo / Creatures Inc. / GAME FREAK inc.
        </p>
      </div>
    </footer>
  )
}
