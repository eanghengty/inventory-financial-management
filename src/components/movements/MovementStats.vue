<script setup>
defineProps({ totalIn: Number, totalOut: Number, net: Number })
</script>

<template>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">TOTAL RECEIVED</div>
      <div style="font-size:28px;font-weight:700;color:var(--accent)">{{ totalIn }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Units in</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--warn)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">TOTAL DISPATCHED</div>
      <div style="font-size:28px;font-weight:700;color:var(--warn)">{{ totalOut }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Units out</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent3)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">NET MOVEMENT</div>
      <div style="font-size:28px;font-weight:700" :style="{ color: net >= 0 ? 'var(--accent)' : 'var(--danger)' }">{{ net >= 0 ? '+' : '' }}{{ net }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">In − Out</div>
    </div>
  </div>
</template>
