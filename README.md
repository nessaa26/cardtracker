# Pokémon Card Availability Tracker

A community-driven tool to track where Pokémon TCG products are available, across regions and retailers.

**Live demo**: https://nessaa26.github.io/cardtracker/

---

## Features

- 📦 Track product name, set/series, region, retailer, release date, and availability status
- 🔍 Search by product name, set, or retailer
- 🎛️ Filter by region, retailer, and status; sort by multiple fields
- ✏️ Add, edit, duplicate, and delete entries
- 💾 All data stored client-side in `localStorage` (no backend)
- 📤 Export data to JSON / Import from JSON with smart merge
- 🌙 Dark mode toggle (preference saved in localStorage)
- 📱 Responsive: table on desktop, cards on mobile
- 🚀 Deploys to GitHub Pages via GitHub Actions

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or v20+
- [npm](https://npmjs.com/)

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/nessaa26/cardtracker.git
cd cardtracker

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# Open http://localhost:5173/cardtracker/
```

### Other commands

```bash
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Configuration

### Change the repo name / base path

If your GitHub repository is named differently, update `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/',  // ← change this
})
```

---

## Deploying to GitHub Pages

### 1. Enable GitHub Pages

Go to your repository **Settings → Pages** and set **Source** to **GitHub Actions**.

### 2. Push to `main`

The `.github/workflows/deploy.yml` workflow will automatically:

1. Install dependencies (`npm ci`)
2. Build the project (`npm run build`)
3. Deploy the `dist/` folder to GitHub Pages

You can also trigger a deploy manually from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

### 3. Access your site

After a successful deploy, your site will be available at:

```
https://<your-github-username>.github.io/<repo-name>/
```

---

## Import / Export

### Export

Go to **Settings** and click **Export JSON**. A file named `pct-export-YYYY-MM-DD.json` will be downloaded containing all entries.

### Import

Go to **Settings** and click **Import JSON**. Select a previously exported file. The merge strategy:

- If an incoming entry's `id` matches an existing one, it replaces the existing entry **only if** `updatedAt` is newer.
- If the `id` is new, the entry is added.

### Format

```json
[
  {
    "id": "unique-id",
    "productName": "Scarlet & Violet Booster Box",
    "setOrSeries": "Scarlet & Violet",
    "releaseDate": "2023-03-31",
    "region": "US",
    "retailer": "Pokemon Center",
    "productUrl": "https://www.pokemoncenter.com",
    "status": "in_stock",
    "lastChecked": "2024-10-01",
    "price": 143.99,
    "currency": "USD",
    "notes": "Optional notes here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-10-01T00:00:00.000Z"
  }
]
```

**Available statuses:** `rumored` | `announced` | `preorder` | `in_stock` | `out_of_stock` | `discontinued`

**Available regions:** `US` | `CA` | `EU` | `UK` | `JP` | `AU` | `OTHER`

---

## Data Disclaimer

> ⚠️ The data in this tracker is community-managed and may be inaccurate, incomplete, or out of date. Always verify availability directly with official retailers before making purchasing decisions.

Pokémon, Pikachu and all related names are trademarks of Nintendo / Creatures Inc. / GAME FREAK inc. This is an unofficial fan-made tool and is not affiliated with or endorsed by Nintendo, The Pokémon Company, or any retailer listed.

---

## Project Structure

```
cardtracker/
├── .github/workflows/deploy.yml   # GitHub Actions deploy workflow
├── public/                        # Static assets
├── src/
│   ├── data/seed.json             # Built-in seed dataset (~15 entries)
│   ├── lib/
│   │   ├── storage.ts             # localStorage read/write with versioning
│   │   ├── date.ts                # Date formatting helpers
│   │   ├── id.ts                  # ID generation
│   │   ├── filters.ts             # Filter + sort logic
│   │   └── merge.ts               # Import merge strategy
│   ├── hooks/
│   │   ├── useLocalStorageState.ts
│   │   └── useDebouncedValue.ts
│   ├── components/                # Reusable UI components
│   ├── pages/                     # Route-level page components
│   ├── types.ts                   # TypeScript types
│   ├── router.tsx                 # HashRouter setup
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
└── tsconfig.json
```