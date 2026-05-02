<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { PALETTE } from '../../utils/constants'

const props = defineProps({ products: Array })

const chartData = computed(() => {
  const map = {}
  props.products.forEach(p => { map[p.cat] = (map[p.cat] || 0) + p.qty })
  return {
    labels: Object.keys(map),
    datasets: [{
      label: 'Units',
      data: Object.values(map),
      backgroundColor: PALETTE,
      borderRadius: 5,
      borderWidth: 0
    }]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(128,128,128,.07)' }, ticks: { color: '#6b7080' } },
    y: { grid: { display: false }, ticks: { color: '#6b7080' } }
  }
}
</script>

<template>
  <div style="height:200px">
    <Bar v-if="products.length" :data="chartData" :options="options" />
    <div v-else style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">No data</div>
  </div>
</template>
