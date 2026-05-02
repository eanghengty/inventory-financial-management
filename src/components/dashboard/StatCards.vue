<script setup>
import { fmtMoney } from '../../utils/formatters'
defineProps({ totalProducts: Number, totalCategories: Number, inventoryValue: Number, lowCount: Number, cashFlow: Number })
</script>

<template>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">TOTAL PRODUCTS</div>
      <div style="font-size:30px;font-weight:700">{{ totalProducts }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">{{ totalCategories }} categories</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent3)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">INVENTORY VALUE</div>
      <div style="font-size:30px;font-weight:700">{{ fmtMoney(inventoryValue) }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">At cost price</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--warn)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">LOW / OUT OF STOCK</div>
      <div style="font-size:30px;font-weight:700;color:var(--warn)">{{ lowCount }}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Need restocking</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent2)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">NET CASH FLOW</div>
      <div style="font-size:30px;font-weight:700" :style="{ color: cashFlow >= 0 ? 'var(--accent)' : 'var(--danger)' }">
        {{ cashFlow < 0 ? '-' : '' }}{{ fmtMoney(cashFlow) }}
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">Income − Expenses</div>
    </div>
  </div>
</template>
