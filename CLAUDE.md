# StockVault — CLAUDE.md

## Project Overview
StockVault is a single-page inventory and finance management app built with Vue 3 + Vite. All data is stored in **IndexedDB** (via the `idb` library) — no backend, no localStorage.

## Dev Commands
```bash
npm run dev      # starts at http://localhost:5008
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Tech Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite 8** with `@tailwindcss/vite` plugin (Tailwind v4)
- **Chart.js 4** via `vue-chartjs` — registered globally in `main.js`
- **idb 8** — IndexedDB wrapper used in all composables
- No Pinia, no Vue Router — single-page with manual tab switching

## Project Structure
```
src/
├── main.js                    # DB init → Chart.register → createApp
├── App.vue                    # root: activeTab ref, v-show tab switching
├── style.css                  # Tailwind import + CSS custom properties (design tokens)
├── utils/
│   ├── formatters.js          # fmtMoney, today(), uid(), fmtDate()
│   └── constants.js           # PALETTE, TXN_CATS, stockStatus()
├── composables/
│   ├── useDb.js               # getDb() singleton — IndexedDB schema bootstrap
│   ├── useProducts.js         # reactive products ref + CRUD
│   ├── useMovements.js        # reactive movements ref + addMovement (atomic tx)
│   ├── useTransactions.js     # reactive transactions ref + CRUD
│   ├── useTheme.js            # isDark ref, loadTheme(), toggleTheme()
│   └── useBackup.js           # exportData() + importData() for backup/restore
└── components/
    ├── layout/AppHeader.vue   # nav tabs (incl. Admin), live clock, theme toggle
    ├── shared/
    │   ├── BaseModal.vue      # Teleport modal wrapper (Esc to close, backdrop click)
    │   └── StatusBadge.vue    # In Stock / Low Stock / Out of Stock badge
    ├── dashboard/             # DashboardView + StatCards + charts + tables
    ├── inventory/             # InventoryView + Filters + Table + ProductModal
    ├── movements/             # MovementsView + Stats + Table + MovementModal
    ├── finance/               # FinanceView + Summary + charts + TransactionModal
    └── admin/
        └── AdminView.vue      # Export backup + Import/restore with drag & drop
```

## IndexedDB Schema (`stockvault_db` v1)
| Store        | keyPath | Key Indexes                          |
|--------------|---------|--------------------------------------|
| products     | id      | sku (unique), cat, createdAt         |
| movements    | id      | productId, type, date                |
| transactions | id      | type, cat, date                      |
| settings     | key     | — (stores `{ key:'theme', value }`)  |

## Data Models
```js
// Product
{ id, sku, name, cat, qty, reorder, cost, sell, note, createdAt }

// Movement
{ id, productId, productName, productSku, type ('in'|'out'|'adjust'), qty, date, note, by }

// Transaction
{ id, type ('income'|'expense'), desc, cat, date, amount }
```

## Backup & Restore (Admin Tab)

### Export (`useBackup.js → exportData`)
- Reads all four IndexedDB stores in parallel
- Wraps them in `{ _meta: { version, exportedAt, app:'StockVault' }, products, movements, transactions, settings }`
- Triggers a browser download as `stockvault-backup-YYYY-MM-DD.json`

### Import (`useBackup.js → importData`)
- Validates the file is JSON and has `_meta.app === 'StockVault'`
- Clears each store then repopulates one record at a time (calls `onProgress` callback for a progress bar)
- After a successful import, the page reloads via `window.location.reload()` — this is intentional because composable singletons cache data in module-level refs and cannot be reset without a reload

### Import gotcha
Never try to refresh reactive state after import without a page reload. The `loaded` flag in each composable (`useProducts`, `useMovements`, `useTransactions`) prevents a second DB read. The reload is the correct solution.

## Key Architecture Rules
- **`v-show` not `v-if` on tab views** — keeps Chart.js canvases alive; never switch to `v-if` or charts break on tab re-entry.
- **Composable singletons** — `products`, `movements`, `transactions` are module-level `ref([])` arrays loaded once. All components share the same reactive state without Pinia.
- **Atomic movement saves** — `addMovement` in `useMovements.js` uses a single `db.transaction(['movements','products'], 'readwrite')` so qty and movement record are always consistent.
- **No demo/seed data** — app starts empty. Never add seed data to composables.
- **Chart.js registered once** in `main.js` via `Chart.register(...registerables)` before `createApp`.
- **Template auto-unwraps refs** — never use `.value` inside `<template>`. Vue unwraps computed/ref automatically; using `.value` returns `undefined` and causes runtime errors.

## CSS Design Tokens
All colours are CSS custom properties on `:root` (dark mode default) and `:root.light` (light mode). Key tokens: `--bg`, `--surface`, `--surface2`, `--border`, `--accent`, `--accent2`, `--accent3`, `--text`, `--muted`, `--danger`, `--success`, `--warn`.

Theme is toggled by adding/removing the `light` class on `<html>` — see `useTheme.js`.

## Adding New Features
- **New tab**: add a view component, add to `App.vue` with `v-show`, add the tab name to the array in `AppHeader.vue`
- **New DB store**: bump the DB version in `useDb.js` and add the store in the `upgrade` callback
- **New chart**: use a `vue-chartjs` component (`Bar`, `Line`, `Doughnut`) with a `computed` `chartData` prop passed from the parent view
- **Backup format change**: bump `VERSION` in `useBackup.js` and add a migration block in `importData` if the shape changes
