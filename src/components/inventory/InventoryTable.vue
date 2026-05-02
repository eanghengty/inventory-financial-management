<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
import { fmtMoney } from '../../utils/formatters'
import { stockStatus } from '../../utils/constants'

defineProps({ products: Array })
const emit = defineEmits(['edit', 'delete', 'quickMove'])
</script>

<template>
  <div class="card" style="overflow-x:auto">
    <table class="data-table">
      <thead>
        <tr>
          <th>SKU</th><th>Product</th><th>Category</th>
          <th>In Stock</th><th>Reorder</th><th>Cost</th><th>Sell</th>
          <th>Stock Value</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!products.length">
          <td colspan="10" style="text-align:center;color:var(--muted);padding:32px">No products found.</td>
        </tr>
        <tr v-for="p in products" :key="p.id">
          <td><span class="sku-tag">{{ p.sku }}</span></td>
          <td style="font-weight:600">{{ p.name }}</td>
          <td style="color:var(--muted)">{{ p.cat }}</td>
          <td style="font-weight:700" :style="{ color: stockStatus(p) !== 'ok' ? 'var(--warn)' : 'var(--text)' }">{{ p.qty }}</td>
          <td style="color:var(--muted)">{{ p.reorder }}</td>
          <td>{{ fmtMoney(p.cost) }}</td>
          <td>{{ fmtMoney(p.sell) }}</td>
          <td style="font-weight:600">{{ fmtMoney(p.qty * p.cost) }}</td>
          <td><StatusBadge :product="p" /></td>
          <td>
            <div style="display:flex;gap:5px;flex-wrap:wrap">
              <button class="btn-sm btn-in"  @click="emit('quickMove', p.id, 'in')">+In</button>
              <button class="btn-sm btn-out" @click="emit('quickMove', p.id, 'out')">−Out</button>
              <button class="btn-sm btn-edit" @click="emit('edit', p.id)">Edit</button>
              <button class="btn-sm btn-del"  @click="emit('delete', p.id)">Del</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
