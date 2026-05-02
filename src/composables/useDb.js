import { openDB } from 'idb'

let _db = null

export async function getDb() {
  if (_db) return _db
  _db = await openDB('stockvault_db', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const products = db.createObjectStore('products', { keyPath: 'id' })
        products.createIndex('sku',       'sku',       { unique: true })
        products.createIndex('cat',       'cat',       { unique: false })
        products.createIndex('createdAt', 'createdAt', { unique: false })

        const movements = db.createObjectStore('movements', { keyPath: 'id' })
        movements.createIndex('productId', 'productId', { unique: false })
        movements.createIndex('type',      'type',      { unique: false })
        movements.createIndex('date',      'date',      { unique: false })

        const txns = db.createObjectStore('transactions', { keyPath: 'id' })
        txns.createIndex('type', 'type', { unique: false })
        txns.createIndex('cat',  'cat',  { unique: false })
        txns.createIndex('date', 'date', { unique: false })

        db.createObjectStore('settings', { keyPath: 'key' })
      }
      if (oldVersion < 2) {
        const catalog = db.createObjectStore('catalog', { keyPath: 'id' })
        catalog.createIndex('name', 'name', { unique: false })
        catalog.createIndex('cat',  'cat',  { unique: false })
      }
    }
  })
  return _db
}
