<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({ title: String })
const emit = defineEmits(['close'])

function onKey(e) { if (e.key === 'Escape') emit('close') }
onMounted(() => { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKey) })
onUnmounted(() => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) })
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay open" @click.self="emit('close')">
      <div class="modal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div style="font-size:16px;font-weight:700">{{ title }}</div>
          <button @click="emit('close')" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:20px;line-height:1">×</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
