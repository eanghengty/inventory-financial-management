<script setup>
import { computed } from 'vue'
import { useProducts } from '../../composables/useProducts'

const props = defineProps({
  search: String,
  catFilter: String,
  statusFilter: String
})
const emit = defineEmits(['update:search', 'update:catFilter', 'update:statusFilter'])

const { products } = useProducts()
const categories = computed(() => [...new Set(products.value.map(p => p.cat).filter(Boolean))].sort())
</script>

<template>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <div class="search-wrap" style="flex:1;min-width:200px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input class="inp" :value="search" @input="emit('update:search', $event.target.value)"
        placeholder="Search name, SKU, category…" />
    </div>
    <select class="inp" style="width:160px" :value="catFilter" @change="emit('update:catFilter', $event.target.value)">
      <option value="">All Categories</option>
      <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
    </select>
    <select class="inp" style="width:140px" :value="statusFilter" @change="emit('update:statusFilter', $event.target.value)">
      <option value="">All Status</option>
      <option value="ok">In Stock</option>
      <option value="low">Low Stock</option>
      <option value="out">Out of Stock</option>
    </select>
  </div>
</template>
