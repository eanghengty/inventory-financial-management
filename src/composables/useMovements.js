import { ref } from 'vue'
import { getDb } from './useDb'
import { useProducts } from './useProducts'

const movements = ref([])
let loaded = false

export function useMovements() {
  const { products } = useProducts()

  async function load() {
    if (loaded) return
    const db = await getDb()
    movements.value = await db.getAll('movements')
    loaded = true
  }

  async function addMovement(data) {
    const db = await getDb()
    const tx = db.transaction(['movements', 'products'], 'readwrite')
    await tx.objectStore('movements').add(data)

    const p = await tx.objectStore('products').get(data.productId)
    if (p) {
      if (data.type === 'in')     p.qty += data.qty
      else if (data.type === 'out') p.qty = Math.max(0, p.qty - data.qty)
      else if (data.type === 'adjust') p.qty = data.qty
      await tx.objectStore('products').put(p)
    }
    await tx.done

    movements.value.push(data)

    // sync product in reactive state
    if (p) {
      const idx = products.value.findIndex(x => x.id === p.id)
      if (idx !== -1) products.value[idx] = { ...products.value[idx], qty: p.qty }
    }
  }

  return { movements, load, addMovement }
}
