<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({ activeTab: String })
const emit = defineEmits(['switchTab'])

const { isDark, toggleTheme } = useTheme()
const timeStr = ref('')
const dateStr = ref('')

let timer = null
function updateClock() {
  const now = new Date()
  timeStr.value = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  dateStr.value = now.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => { updateClock(); timer = setInterval(updateClock, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header class="sticky top-0 z-50" style="border-bottom:1px solid var(--border);backdrop-filter:blur(12px)">
    <div style="max-width:1280px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px">
      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:34px;height:34px;background:var(--accent);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <span style="font-size:17px;font-weight:700">Stock<span style="color:var(--accent)">Vault</span></span>
      </div>

      <!-- Nav -->
      <nav style="display:flex;gap:4px">
        <button v-for="tab in ['dashboard','inventory','movements','finance','admin']" :key="tab"
          class="nav-link" :class="{ active: activeTab === tab }"
          @click="emit('switchTab', tab)">
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </nav>

      <!-- Clock + Theme -->
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:12px;color:var(--muted);text-align:right">
          <div>{{ timeStr }}</div>
          <div>{{ dateStr }}</div>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          <span>{{ isDark ? '☀️' : '🌙' }}</span>
          <div class="toggle-track"><div class="toggle-thumb"></div></div>
          <span>{{ isDark ? 'Light' : 'Dark' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
