<script setup>
import { fmtDate } from '../../utils/formatters'
defineProps({ movements: Array })
</script>

<template>
  <div class="card" style="overflow-x:auto">
    <table class="data-table">
      <thead>
        <tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Reference</th><th>Handled By</th></tr>
      </thead>
      <tbody>
        <tr v-if="!movements.length">
          <td colspan="6" style="text-align:center;color:var(--muted);padding:32px">No movements recorded yet.</td>
        </tr>
        <tr v-for="m in [...movements].reverse()" :key="m.id">
          <td style="color:var(--muted)">{{ fmtDate(m.date) }}</td>
          <td>
            <div style="font-weight:600">{{ m.productName }}</div>
            <div style="font-size:11px;color:var(--accent3)">{{ m.productSku }}</div>
          </td>
          <td>
            <span class="badge" :class="{
              'badge-success': m.type === 'in',
              'badge-warn':    m.type === 'out',
              'badge-info':    m.type === 'adjust'
            }">
              {{ m.type === 'in' ? 'Stock In' : m.type === 'out' ? 'Stock Out' : 'Adjustment' }}
            </span>
          </td>
          <td style="font-weight:700" :style="{ color: m.type === 'in' ? 'var(--accent)' : m.type === 'out' ? 'var(--warn)' : 'var(--accent3)' }">
            {{ m.type === 'in' ? '+' : m.type === 'out' ? '−' : '=' }}{{ m.qty }}
          </td>
          <td style="color:var(--muted)">{{ m.note || '—' }}</td>
          <td style="color:var(--muted)">{{ m.by || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
