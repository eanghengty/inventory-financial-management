<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
import { stockStatus } from '../../utils/constants'

const props = defineProps({ products: Array })
const lowItems = () => props.products.filter(p => stockStatus(p) !== 'ok')
</script>

<template>
  <div class="card">
    <div style="padding:13px 16px;border-bottom:1px solid var(--border);font-weight:700;display:flex;align-items:center;gap:8px">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      Low Stock Alerts
    </div>
    <table class="data-table">
      <thead><tr><th>Product</th><th>In Stock</th><th>Reorder At</th><th>Status</th></tr></thead>
      <tbody>
        <tr v-if="!lowItems().length">
          <td colspan="4" style="text-align:center;color:var(--muted);padding:24px">All products are well stocked.</td>
        </tr>
        <tr v-for="p in lowItems()" :key="p.id">
          <td>
            <div style="font-weight:600">{{ p.name }}</div>
            <div style="font-size:11px;color:var(--accent3)">{{ p.sku }}</div>
          </td>
          <td style="font-weight:700;color:var(--warn)">{{ p.qty }}</td>
          <td style="color:var(--muted)">{{ p.reorder }}</td>
          <td><StatusBadge :product="p" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
