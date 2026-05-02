<script setup>
import { fmtMoney } from '../../utils/formatters'
defineProps({ totalIncome: Number, totalExpense: Number, netProfit: Number, margin: Number })
</script>

<template>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">TOTAL INCOME</div>
      <div style="font-size:28px;font-weight:700;color:var(--accent)">{{ fmtMoney(totalIncome) }}</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--danger)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">TOTAL EXPENSES</div>
      <div style="font-size:28px;font-weight:700;color:var(--danger)">{{ fmtMoney(totalExpense) }}</div>
    </div>
    <div class="stat-card">
      <div class="accent-bar" style="background:var(--accent3)"></div>
      <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--muted);margin-bottom:10px">NET PROFIT</div>
      <div style="font-size:28px;font-weight:700" :style="{ color: netProfit >= 0 ? 'var(--accent)' : 'var(--danger)' }">
        {{ netProfit < 0 ? '-' : '' }}{{ fmtMoney(netProfit) }}
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:4px">{{ margin.toFixed(1) }}% margin</div>
    </div>
  </div>
</template>
