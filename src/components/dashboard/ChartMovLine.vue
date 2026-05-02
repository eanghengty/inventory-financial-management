<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps({ movements: Array })

const chartData = computed(() => {
  const days = []
  const labels = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push(key)
    labels.push(d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' }))
  }
  const inData  = days.map(d => props.movements.filter(m => m.date === d && m.type === 'in').reduce((s, m) => s + m.qty, 0))
  const outData = days.map(d => props.movements.filter(m => m.date === d && m.type === 'out').reduce((s, m) => s + m.qty, 0))
  return {
    labels,
    datasets: [
      { label: 'In',  data: inData,  borderColor: '#00b87a', backgroundColor: 'rgba(0,184,122,.1)', tension: 0.3, fill: true, pointRadius: 3 },
      { label: 'Out', data: outData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.1)', tension: 0.3, fill: true, pointRadius: 3 }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#6b7080', boxWidth: 12, font: { size: 11 } } } },
  scales: {
    x: { grid: { color: 'rgba(128,128,128,.07)' }, ticks: { color: '#6b7080', font: { size: 11 } } },
    y: { grid: { color: 'rgba(128,128,128,.07)' }, ticks: { color: '#6b7080', font: { size: 11 } }, beginAtZero: true }
  }
}
</script>

<template>
  <div style="height:200px">
    <Line :data="chartData" :options="options" />
  </div>
</template>
