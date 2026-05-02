<script setup>
import { reactive, computed, watch } from 'vue'
import BaseModal from '../shared/BaseModal.vue'
import { useProducts } from '../../composables/useProducts'
import { useMovements } from '../../composables/useMovements'
import { uid, today } from '../../utils/formatters'

const props = defineProps({ preset: { type: Object, default: () => ({ productId: null, type: 'in' }) } })
const emit = defineEmits(['close'])

const { products } = useProducts()
const { addMovement } = useMovements()

const form = reactive({ productId: '', type: 'in', qty: 1, date: today(), note: '', by: '' })
const error = reactive({ productId: '', qty: '' })

watch(() => props.preset, (p) => {
  if (p?.productId) form.productId = p.productId
  if (p?.type) form.type = p.type
}, { immediate: true })

const selectedProduct = computed(() => products.value.find(p => p.id === form.productId) || null)

async function save() {
  error.productId = ''; error.qty = ''
  let valid = true
  if (!form.productId) { error.productId = 'Select a product'; valid = false }
  const qty = Number(form.qty)
  if (!qty || qty <= 0) { error.qty = 'Enter a valid quantity'; valid = false }
  if (form.type === 'out' && selectedProduct.value && qty > selectedProduct.value.qty) {
    error.qty = `Only ${selectedProduct.value.qty} units available`; valid = false
  }
  if (!valid) return

  const p = selectedProduct.value
  await addMovement({
    id: uid(), productId: p.id, productName: p.name, productSku: p.sku,
    type: form.type, qty, date: form.date, note: form.note.trim(), by: form.by.trim()
  })
  emit('close')
}
</script>

<template>
  <BaseModal title="Record Stock Movement" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Product *</label>
      <select class="inp" v-model="form.productId">
        <option value="">— Select Product —</option>
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} ({{ p.sku }})</option>
      </select>
      <div v-if="error.productId" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.productId }}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Movement Type *</label>
      <select class="inp" v-model="form.type">
        <option value="in">Stock In (Received)</option>
        <option value="out">Stock Out (Dispatched)</option>
        <option value="adjust">Adjustment (Set absolute qty)</option>
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">
          {{ form.type === 'adjust' ? 'New Qty' : 'Quantity' }} *
          <span v-if="selectedProduct && form.type === 'out'" style="color:var(--muted);font-weight:400">
            ({{ selectedProduct.qty }} avail.)
          </span>
        </label>
        <input class="inp" type="number" min="0" v-model="form.qty" />
        <div v-if="error.qty" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.qty }}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="inp" type="date" v-model="form.date" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Reference / Note</label>
      <input class="inp" v-model="form.note" placeholder="PO number, order ID, etc." />
    </div>
    <div class="form-group">
      <label class="form-label">Handled By</label>
      <input class="inp" v-model="form.by" placeholder="Staff name (optional)" />
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
      <button class="btn" style="background:var(--surface2);color:var(--text)" @click="emit('close')">Cancel</button>
      <button class="btn btn-primary" @click="save">Save Movement</button>
    </div>
  </BaseModal>
</template>
