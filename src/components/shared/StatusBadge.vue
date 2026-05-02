<script setup>
import { computed } from 'vue'
import { stockStatus } from '../../utils/constants'

const props = defineProps({ product: Object })
const status = computed(() => stockStatus(props.product))
</script>

<template>
  <span class="badge" :class="{
    'badge-danger': status === 'out',
    'badge-warn':   status === 'low',
    'badge-success': status === 'ok'
  }">
    {{ status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock' }}
  </span>
</template>
