<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps({ transactions: Array })

const chartData = computed(() => {
  const months = []
  const labels = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    months.push({ y: d.getFullYear(), m: d.getMonth() + 1 })
    labels.push(d.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' }))
  }
  const incData = months.map(({ y, m }) =>
    props.transactions.filter(t => t.type === 'income' && t.date?.startsWith(`${y}-${String(m).padStart(2,'0')}`))
      .reduce((s, t) => s + t.amount, 0)
  )
  const expData = months.map(({ y, m }) =>
    props.transactions.filter(t => t.type === 'expense' && t.date?.startsWith(`${y}-${String(m).padStart(2,'0')}`))
      .reduce((s, t) => s + t.amount, 0)
  )
  return {
    labels,
    datasets: [
      { label: 'Income',  data: incData, backgroundColor: 'rgba(0,184,122,.7)',  borderRadius: 4 },
      { label: 'Expenses', data: expData, backgroundColor: 'rgba(255,71,87,.7)', borderRadius: 4 }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#6b7080', boxWidth: 12, font: { size: 11 } } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#6b7080' } },
    y: { grid: { color: 'rgba(128,128,128,.07)' }, ticks: { color: '#6b7080', callback: v => '$' + v } }
  }
}
</script>

<template>
  <div style="height:220px">
    <Bar v-if="transactions.length" :data="chartData" :options="options" />
    <div v-else style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">No data</div>
  </div>
</template>
