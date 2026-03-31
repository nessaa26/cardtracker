export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">About</h1>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          What is this?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          The <strong>Card Tracker</strong> is a community-driven tool to
          track where <strong>Pokémon TCG</strong> and <strong>One Piece TCG</strong> card products are available, across regions and
          retailers. It includes release dates, availability statuses, prices, and links.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          All data is stored locally in your browser using <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">localStorage</code>. Nothing is
          sent to any server.
        </p>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Supported Card Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200/60 dark:border-amber-700/40">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-amber-800 dark:text-amber-300">Pokémon TCG</h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mt-1">Track booster boxes, ETBs, premium collections, and more across all Pokémon TCG sets.</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-200/60 dark:border-red-700/40">
            <div className="text-2xl mb-2">☠️</div>
            <h3 className="font-bold text-red-800 dark:text-red-300">One Piece TCG</h3>
            <p className="text-sm text-red-700/80 dark:text-red-400/80 mt-1">Track booster boxes, starter decks, and promo sets across all One Piece Card Game releases.</p>
          </div>
        </div>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Data accuracy disclaimer
        </h2>
        <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
          ⚠️ <strong>Important:</strong> The data in this tracker is community-managed and may be
          inaccurate, incomplete, or out of date. Always verify availability directly with
          official retailers before making any purchasing decisions.
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Availability, pricing, and release dates can change rapidly. The "Last Checked" date
          indicates when a particular entry was last verified.
        </p>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Availability statuses explained
        </h2>
        <dl className="space-y-3 text-sm">
          {[
            { status: '💭 Rumored', desc: 'Product has been leaked or hinted at but not officially confirmed.' },
            { status: '📢 Announced', desc: 'Product has been officially announced by the publisher.' },
            { status: '🛒 Preorder', desc: 'Product is available for preorder and ships on release date.' },
            { status: '✅ In Stock', desc: 'Product is currently available for purchase.' },
            { status: '❌ Out of Stock', desc: 'Product is sold out but may be restocked.' },
            { status: '⛔ Discontinued', desc: 'Product is no longer being manufactured or distributed.' },
          ].map(({ status, desc }) => (
            <div key={status} className="flex gap-3 items-start">
              <dt className="font-bold text-gray-700 dark:text-gray-300 w-36 flex-shrink-0">
                {status}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 p-6 space-y-3 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Legal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Pokémon, Pikachu and all related names are trademarks of Nintendo / Creatures Inc. /
          GAME FREAK inc. One Piece and all related names are trademarks of Eiichiro Oda / Shueisha / Toei Animation.
          One Piece Card Game is a trademark of Bandai Co., Ltd.
          This is an unofficial fan-made tool and is not affiliated with or
          endorsed by any of the above companies or any retailer listed.
        </p>
      </section>
    </div>
  )
}
