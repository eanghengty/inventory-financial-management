import { ref } from 'vue'
import { getDb } from './useDb'

const autoTransactionOnStockOut = ref(true)

export function useAppSettings() {
  async function loadSettings() {
    const db = await getDb()
    const row = await db.get('settings', 'autoTransactionOnStockOut')
    autoTransactionOnStockOut.value = row === undefined || row.value !== false
  }

  async function toggleAutoTransaction() {
    autoTransactionOnStockOut.value = !autoTransactionOnStockOut.value
    const db = await getDb()
    await db.put('settings', { key: 'autoTransactionOnStockOut', value: autoTransactionOnStockOut.value })
  }

  return { autoTransactionOnStockOut, loadSettings, toggleAutoTransaction }
}
