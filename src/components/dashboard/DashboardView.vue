<script setup>
import { computed } from 'vue'
import StatCards from './StatCards.vue'
import LowStockTable from './LowStockTable.vue'
import RecentMovements from './RecentMovements.vue'
import ChartCatBar from './ChartCatBar.vue'
import ChartMovLine from './ChartMovLine.vue'
import { useProducts } from '../../composables/useProducts'
import { useMovements } from '../../composables/useMovements'
import { useTransactions } from '../../composables/useTransactions'
import { stockStatus } from '../../utils/constants'

const { products } = useProducts()
const { movements } = useMovements()
const { transactions } = useTransactions()

const totalProducts   = computed(() => products.value.length)
const totalCategories = computed(() => new Set(products.value.map(p => p.cat)).size)
const inventoryValue  = computed(() => products.value.reduce((s, p) => s + p.qty * p.cost, 0))
const lowCount        = computed(() => products.value.filter(p => stockStatus(p) !== 'ok').length)
const cashFlow        = computed(() => {
  const inc = transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const exp = transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return inc - exp
})
const lowItems = computed(() => products.value.filter(p => stockStatus(p) !== 'ok'))
</script>

<template>
  <div>
    <!-- Low stock alert banner -->
    <div v-if="lowCount > 0" class="alert-banner" style="margin-bottom:18px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span style="color:var(--danger);font-weight:700">
        {{ lowCount }} product{{ lowCount > 1 ? 's' : '' }} need restocking —
        {{ products.filter(p => p.qty === 0).length }} out of stock
      </span>
    </div>

    <StatCards
      :totalProducts="totalProducts"
      :totalCategories="totalCategories"
      :inventoryValue="inventoryValue"
      :lowCount="lowCount"
      :cashFlow="cashFlow"
    />

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="card" style="padding:20px">
        <div style="font-weight:700;margin-bottom:4px">Stock by Category</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Total units per category</div>
        <ChartCatBar :products="products" />
      </div>
      <div class="card" style="padding:20px">
        <div style="font-weight:700;margin-bottom:4px">Stock Movements — Last 7 Days</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Units in vs out</div>
        <ChartMovLine :movements="movements" />
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <LowStockTable :products="products" />
      <RecentMovements :movements="movements" />
    </div>
  </div>
</template>
