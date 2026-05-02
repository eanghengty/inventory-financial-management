<script setup>
import { computed } from 'vue'
import { fmtDate } from '../../utils/formatters'
defineProps({ movements: Array })
</script>

<template>
  <div class="card">
    <div style="padding:13px 16px;border-bottom:1px solid var(--border);font-weight:700">Recent Movements</div>
    <table class="data-table">
      <thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th></tr></thead>
      <tbody>
        <tr v-if="!movements.length">
          <td colspan="4" style="text-align:center;color:var(--muted);padding:24px">No movements yet.</td>
        </tr>
        <tr v-for="m in [...movements].reverse().slice(0, 6)" :key="m.id">
          <td style="color:var(--muted)">{{ fmtDate(m.date) }}</td>
          <td style="font-weight:600">{{ m.productName }}</td>
          <td>
            <span class="badge" :class="{
              'badge-success': m.type === 'in',
              'badge-warn':    m.type === 'out',
              'badge-info':    m.type === 'adjust'
            }">
              {{ m.type === 'in' ? 'In' : m.type === 'out' ? 'Out' : 'Adj' }}
            </span>
          </td>
          <td style="font-weight:700" :style="{ color: m.type === 'in' ? 'var(--accent)' : m.type === 'out' ? 'var(--warn)' : 'var(--accent3)' }">
            {{ m.type === 'in' ? '+' : m.type === 'out' ? '−' : '=' }}{{ m.qty }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
