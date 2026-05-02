import { getDb } from './useDb'

const VERSION = 1

export function useBackup() {
  async function exportData() {
    const db = await getDb()
    const [products, movements, transactions, settings] = await Promise.all([
      db.getAll('products'),
      db.getAll('movements'),
      db.getAll('transactions'),
      db.getAll('settings'),
    ])

    const payload = {
      _meta: {
        version: VERSION,
        exportedAt: new Date().toISOString(),
        app: 'StockVault',
      },
      products,
      movements,
      transactions,
      settings,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    a.href     = url
    a.download = `stockvault-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importData(file, { onProgress } = {}) {
    const text = await file.text()
    let payload
    try {
      payload = JSON.parse(text)
    } catch {
      throw new Error('Invalid JSON file.')
    }

    if (payload._meta?.app !== 'StockVault') {
      throw new Error('This file does not appear to be a StockVault backup.')
    }

    const { products = [], movements = [], transactions = [], settings = [] } = payload

    const db = await getDb()

    // Wipe all stores then repopulate inside a single transaction per store
    const stores = ['products', 'movements', 'transactions', 'settings']
    for (const store of stores) {
      const tx = db.transaction(store, 'readwrite')
      await tx.objectStore(store).clear()
      await tx.done
    }

    const total = products.length + movements.length + transactions.length + settings.length
    let done = 0

    for (const item of products) {
      await db.put('products', item)
      onProgress?.(++done, total)
    }
    for (const item of movements) {
      await db.put('movements', item)
      onProgress?.(++done, total)
    }
    for (const item of transactions) {
      await db.put('transactions', item)
      onProgress?.(++done, total)
    }
    for (const item of settings) {
      await db.put('settings', item)
      onProgress?.(++done, total)
    }

    return { products: products.length, movements: movements.length, transactions: transactions.length }
  }

  return { exportData, importData }
}
