export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">About</h1>

      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          What is this?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          The <strong>Pokémon Card Availability Tracker</strong> is a community-driven tool to
          track where Pokémon Trading Card Game products are available, across regions and
          retailers. It includes release dates, availability statuses, prices, and links.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          All data is stored locally in your browser using <code>localStorage</code>. Nothing is
          sent to any server.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Data accuracy disclaimer
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Important:</strong> The data in this tracker is community-managed and may be
          inaccurate, incomplete, or out of date. Always verify availability directly with
          official retailers before making any purchasing decisions.
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Availability, pricing, and release dates can change rapidly. The "Last Checked" date
          indicates when a particular entry was last verified.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Availability statuses explained
        </h2>
        <dl className="space-y-2 text-sm">
          {[
            { status: 'Rumored', desc: 'Product has been leaked or hinted at but not officially confirmed.' },
            { status: 'Announced', desc: 'Product has been officially announced by The Pokémon Company or Nintendo.' },
            { status: 'Preorder', desc: 'Product is available for preorder and ships on release date.' },
            { status: 'In Stock', desc: 'Product is currently available for purchase.' },
            { status: 'Out of Stock', desc: 'Product is sold out but may be restocked.' },
            { status: 'Discontinued', desc: 'Product is no longer being manufactured or distributed.' },
          ].map(({ status, desc }) => (
            <div key={status} className="flex gap-3">
              <dt className="font-semibold text-gray-700 dark:text-gray-300 w-28 flex-shrink-0">
                {status}
              </dt>
              <dd className="text-gray-600 dark:text-gray-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Legal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Pokémon, Pikachu and all related names are trademarks of Nintendo / Creatures Inc. /
          GAME FREAK inc. This is an unofficial fan-made tool and is not affiliated with or
          endorsed by Nintendo, The Pokémon Company, or any retailer listed.
        </p>
      </section>
    </div>
  )
}
