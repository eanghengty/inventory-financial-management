<script setup>
import { ref, computed } from 'vue'
import MovementStats from './MovementStats.vue'
import MovementsTable from './MovementsTable.vue'
import MovementModal from './MovementModal.vue'
import { useMovements } from '../../composables/useMovements'

const { movements } = useMovements()
const showModal = ref(false)

const totalIn  = computed(() => movements.value.filter(m => m.type === 'in').reduce((s, m) => s + m.qty, 0))
const totalOut = computed(() => movements.value.filter(m => m.type === 'out').reduce((s, m) => s + m.qty, 0))
const net      = computed(() => totalIn.value - totalOut.value)
</script>

<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div>
        <div style="font-size:20px;font-weight:700">Stock Movements</div>
        <div style="font-size:13px;color:var(--muted)">{{ movements.length }} records</div>
      </div>
      <button class="btn btn-primary" @click="showModal = true">+ Record Movement</button>
    </div>

    <MovementStats :totalIn="totalIn" :totalOut="totalOut" :net="net" />
    <MovementsTable :movements="movements" />
    <MovementModal v-if="showModal" @close="showModal = false" />
  </div>
</template>
