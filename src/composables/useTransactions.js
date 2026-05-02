import { ref } from 'vue'
import { getDb } from './useDb'

const transactions = ref([])
let loaded = false

export function useTransactions() {
  async function load() {
    if (loaded) return
    const db = await getDb()
    transactions.value = await db.getAll('transactions')
    loaded = true
  }

  async function addTransaction(data) {
    const db = await getDb()
    await db.add('transactions', data)
    transactions.value.push(data)
  }

  async function deleteTransaction(id) {
    const db = await getDb()
    await db.delete('transactions', id)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return { transactions, load, addTransaction, deleteTransaction }
}
