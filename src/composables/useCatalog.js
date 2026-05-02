import { ref } from 'vue'
import { getDb } from './useDb'

const catalog = ref([])
let loaded = false

export function useCatalog() {
  async function load() {
    if (loaded) return
    const db = await getDb()
    catalog.value = await db.getAll('catalog')
    loaded = true
  }

  async function addCatalogItem(data) {
    const db = await getDb()
    await db.add('catalog', data)
    catalog.value.push(data)
  }

  async function updateCatalogItem(id, changes) {
    const db = await getDb()
    const idx = catalog.value.findIndex(c => c.id === id)
    if (idx === -1) return
    const updated = { ...catalog.value[idx], ...changes }
    await db.put('catalog', updated)
    catalog.value[idx] = updated
  }

  async function deleteCatalogItem(id) {
    const db = await getDb()
    await db.delete('catalog', id)
    catalog.value = catalog.value.filter(c => c.id !== id)
  }

  return { catalog, load, addCatalogItem, updateCatalogItem, deleteCatalogItem }
}
