<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { PALETTE } from '../../utils/constants'
import { fmtMoney as fmt } from '../../utils/formatters'

const props = defineProps({ transactions: Array })

const expensesByCat = computed(() => {
  const map = {}
  props.transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.cat] = (map[t.cat] || 0) + t.amount
  })
  return map
})

const chartData = computed(() => ({
  labels: Object.keys(expensesByCat.value),
  datasets: [{
    data: Object.values(expensesByCat.value),
    backgroundColor: PALETTE,
    borderWidth: 0,
    hoverOffset: 6
  }]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: { legend: { display: false } }
}
</script>

<template>
  <div>
    <div style="height:200px">
      <Doughnut v-if="Object.keys(expensesByCat).length" :data="chartData" :options="options" />
      <div v-else style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">No expenses</div>
    </div>
    <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">
      <div v-for="(amt, cat, i) in expensesByCat" :key="cat"
        style="display:flex;align-items:center;justify-content:space-between;font-size:12px">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0" :style="{ background: PALETTE[i % PALETTE.length] }"></span>
          <span style="color:var(--muted)">{{ cat }}</span>
        </div>
        <span style="font-weight:700">{{ fmt(amt) }}</span>
      </div>
    </div>
  </div>
</template>
