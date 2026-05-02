import { ref } from 'vue'
import { getDb } from './useDb'

const isDark = ref(true)

export function useTheme() {
  async function loadTheme() {
    const db = await getDb()
    const row = await db.get('settings', 'theme')
    isDark.value = !row || row.value === 'dark'
    applyClass()
  }

  async function toggleTheme() {
    isDark.value = !isDark.value
    const db = await getDb()
    await db.put('settings', { key: 'theme', value: isDark.value ? 'dark' : 'light' })
    applyClass()
  }

  function applyClass() {
    document.documentElement.classList.toggle('light', !isDark.value)
  }

  return { isDark, loadTheme, toggleTheme }
}
