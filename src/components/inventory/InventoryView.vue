<script setup>
import { ref, computed } from 'vue'
import InventoryFilters from './InventoryFilters.vue'
import InventoryTable from './InventoryTable.vue'
import ProductModal from './ProductModal.vue'
import MovementModal from '../movements/MovementModal.vue'
import { useProducts } from '../../composables/useProducts'
import { stockStatus } from '../../utils/constants'

const { products, deleteProduct } = useProducts()

const search = ref('')
const catFilter = ref('')
const statusFilter = ref('')
const showProductModal = ref(false)
const editingProduct = ref(null)
const showMovementModal = ref(false)
const movementPreset = ref({ productId: null, type: 'in' })

const filtered = computed(() => {
  let list = products.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    )
  }
  if (catFilter.value) list = list.filter(p => p.cat === catFilter.value)
  if (statusFilter.value) list = list.filter(p => stockStatus(p) === statusFilter.value)
  return list
})

function openAdd() { editingProduct.value = null; showProductModal.value = true }
function openEdit(id) { editingProduct.value = products.value.find(p => p.id === id) || null; showProductModal.value = true }
async function confirmDelete(id) {
  const p = products.value.find(x => x.id === id)
  if (confirm(`Delete "${p?.name}"? This cannot be undone.`)) await deleteProduct(id)
}
function quickMove(id, type) { movementPreset.value = { productId: id, type }; showMovementModal.value = true }
</script>

<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div>
        <div style="font-size:20px;font-weight:700">Inventory</div>
        <div style="font-size:13px;color:var(--muted)">{{ products.length }} products</div>
      </div>
      <button class="btn btn-primary" @click="openAdd">+ Add Product</button>
    </div>

    <div style="margin-bottom:16px">
      <InventoryFilters v-model:search="search" v-model:catFilter="catFilter" v-model:statusFilter="statusFilter" />
    </div>

    <InventoryTable :products="filtered"
      @edit="openEdit" @delete="confirmDelete" @quickMove="quickMove" />

    <ProductModal v-if="showProductModal" :editProduct="editingProduct" @close="showProductModal = false" />
    <MovementModal v-if="showMovementModal" :preset="movementPreset" @close="showMovementModal = false" />
  </div>
</template>
