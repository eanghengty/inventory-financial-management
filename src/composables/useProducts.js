import { ref } from 'vue'
import { getDb } from './useDb'

const products = ref([])
let loaded = false

export function useProducts() {
  async function load() {
    if (loaded) return
    const db = await getDb()
    products.value = await db.getAll('products')
    loaded = true
  }

  async function addProduct(data) {
    const db = await getDb()
    await db.add('products', data)
    products.value.push(data)
  }

  async function updateProduct(id, changes) {
    const db = await getDb()
    const idx = products.value.findIndex(p => p.id === id)
    if (idx === -1) return
    const updated = { ...products.value[idx], ...changes }
    await db.put('products', updated)
    products.value[idx] = updated
  }

  async function deleteProduct(id) {
    const db = await getDb()
    await db.delete('products', id)
    products.value = products.value.filter(p => p.id !== id)
  }

  async function skuExists(sku, excludeId = null) {
    return products.value.some(p => p.sku === sku && p.id !== excludeId)
  }

  return { products, load, addProduct, updateProduct, deleteProduct, skuExists }
}
