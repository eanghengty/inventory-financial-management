<script setup>
import { ref, computed } from 'vue'
import FinanceSummary from './FinanceSummary.vue'
import TransactionsTable from './TransactionsTable.vue'
import ChartMonthlyBar from './ChartMonthlyBar.vue'
import ChartExpenseDough from './ChartExpenseDough.vue'
import TransactionModal from './TransactionModal.vue'
import { useTransactions } from '../../composables/useTransactions'

const { transactions, deleteTransaction } = useTransactions()
const showModal = ref(false)
const txnFilter = ref('all')

const filtered = computed(() => {
  if (txnFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.type === txnFilter.value)
})

const totalIncome  = computed(() => transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))
const totalExpense = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
const netProfit    = computed(() => totalIncome.value - totalExpense.value)
const margin       = computed(() => totalIncome.value > 0 ? (netProfit.value / totalIncome.value) * 100 : 0)

async function confirmDelete(id) {
  if (confirm('Delete this transaction?')) await deleteTransaction(id)
}
</script>

<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div>
        <div style="font-size:20px;font-weight:700">Finance</div>
        <div style="font-size:13px;color:var(--muted)">{{ transactions.length }} transactions</div>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Add Transaction</button>
    </div>

    <FinanceSummary :totalIncome="totalIncome" :totalExpense="totalExpense" :netProfit="netProfit" :margin="margin" />

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card" style="padding:20px">
        <div style="font-weight:700;margin-bottom:4px">Monthly Overview</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Last 6 months</div>
        <ChartMonthlyBar :transactions="transactions" />
      </div>
      <div class="card" style="padding:20px">
        <div style="font-weight:700;margin-bottom:4px">Expense by Category</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Breakdown</div>
        <ChartExpenseDough :transactions="transactions" />
      </div>
    </div>

    <div style="margin-bottom:12px;display:flex;gap:8px">
      <button v-for="f in ['all','income','expense']" :key="f"
        class="btn-sm" :class="txnFilter === f ? 'btn-primary' : 'btn-edit'"
        @click="txnFilter = f">
        {{ f.charAt(0).toUpperCase() + f.slice(1) }}
      </button>
    </div>

    <TransactionsTable :transactions="filtered" @delete="confirmDelete" />
    <TransactionModal v-if="showModal" @close="showModal = false" />
  </div>
</template>
