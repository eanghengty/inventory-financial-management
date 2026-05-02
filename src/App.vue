<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import DashboardView from './components/dashboard/DashboardView.vue'
import InventoryView from './components/inventory/InventoryView.vue'
import MovementsView from './components/movements/MovementsView.vue'
import FinanceView from './components/finance/FinanceView.vue'
import AdminView from './components/admin/AdminView.vue'
import { useTheme } from './composables/useTheme'
import { useProducts } from './composables/useProducts'
import { useMovements } from './composables/useMovements'
import { useTransactions } from './composables/useTransactions'
import { useCatalog } from './composables/useCatalog'
import { useAppSettings } from './composables/useAppSettings'

const activeTab = ref('dashboard')
const { loadTheme } = useTheme()
const { load: loadProducts } = useProducts()
const { load: loadMovements } = useMovements()
const { load: loadTransactions } = useTransactions()
const { load: loadCatalog } = useCatalog()
const { loadSettings } = useAppSettings()

onMounted(async () => {
  await loadTheme()
  await Promise.all([loadProducts(), loadMovements(), loadTransactions(), loadCatalog(), loadSettings()])
})
</script>

<template>
  <AppHeader :active-tab="activeTab" @switch-tab="activeTab = $event" />
  <main style="max-width:1280px;margin:0 auto;padding:28px 24px">
    <DashboardView v-show="activeTab === 'dashboard'" />
    <InventoryView v-show="activeTab === 'inventory'" />
    <MovementsView v-show="activeTab === 'movements'" />
    <FinanceView v-show="activeTab === 'finance'" />
    <AdminView  v-show="activeTab === 'admin'" @switch-tab="activeTab = $event" />
  </main>
</template>
