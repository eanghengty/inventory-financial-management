import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js'
import './style.css'
import App from './App.vue'
import { getDb } from './composables/useDb'

Chart.register(...registerables)

getDb().then(() => {
  createApp(App).mount('#app')
})
