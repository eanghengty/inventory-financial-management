<script setup>
import { fmtMoney, fmtDate } from '../../utils/formatters'
defineProps({ transactions: Array })
const emit = defineEmits(['delete'])
</script>

<template>
  <div class="card" style="overflow-x:auto">
    <table class="data-table">
      <thead>
        <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-if="!transactions.length">
          <td colspan="6" style="text-align:center;color:var(--muted);padding:32px">No transactions recorded yet.</td>
        </tr>
        <tr v-for="t in [...transactions].reverse()" :key="t.id">
          <td style="color:var(--muted)">{{ fmtDate(t.date) }}</td>
          <td style="font-weight:600">{{ t.desc }}</td>
          <td style="color:var(--muted)">{{ t.cat }}</td>
          <td>
            <span class="badge" :class="t.type === 'income' ? 'badge-success' : 'badge-danger'">
              {{ t.type === 'income' ? 'Income' : 'Expense' }}
            </span>
          </td>
          <td style="font-weight:700" :style="{ color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)' }">
            {{ t.type === 'income' ? '+' : '-' }}{{ fmtMoney(t.amount) }}
          </td>
          <td>
            <button class="btn-sm btn-del" @click="emit('delete', t.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
