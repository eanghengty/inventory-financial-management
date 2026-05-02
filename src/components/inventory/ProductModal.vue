<script setup>
import { reactive, watch, computed } from 'vue'
import BaseModal from '../shared/BaseModal.vue'
import { useProducts } from '../../composables/useProducts'
import { useMovements } from '../../composables/useMovements'
import { useCatalog } from '../../composables/useCatalog'
import { uid, today } from '../../utils/formatters'

const props = defineProps({ editProduct: { type: Object, default: null } })
const emit = defineEmits(['close'])

const { products, addProduct, updateProduct, skuExists } = useProducts()
const { addMovement } = useMovements()
const { catalog } = useCatalog()

const defaultForm = () => ({ sku: '', name: '', cat: '', qty: 0, reorder: 5, cost: 0, sell: 0, note: '' })
const form = reactive(defaultForm())
const error = reactive({ sku: '', name: '', cat: '' })

const isEdit = computed(() => !!props.editProduct)
const title = computed(() => isEdit.value ? 'Edit Product' : 'Add Product')

const catalogNames = computed(() => catalog.value.map(c => c.name))
const categories = computed(() => {
  const fromProducts = products.value.map(p => p.cat).filter(Boolean)
  const fromCatalog = catalog.value.map(c => c.cat).filter(Boolean)
  return [...new Set([...fromProducts, ...fromCatalog])].sort()
})

function onNameChange() {
  const match = catalog.value.find(c => c.name.toLowerCase() === form.name.trim().toLowerCase())
  if (match) {
    if (!form.cat) form.cat = match.cat
    if (!form.sku && match.productNo) form.sku = match.productNo
  }
}

watch(() => props.editProduct, (p) => {
  if (p) {
    form.sku = p.sku; form.name = p.name; form.cat = p.cat
    form.qty = p.qty; form.reorder = p.reorder; form.cost = p.cost
    form.sell = p.sell; form.note = p.note || ''
  } else {
    Object.assign(form, defaultForm())
  }
  error.sku = ''; error.name = ''; error.cat = ''
}, { immediate: true })

async function save() {
  error.sku = ''; error.name = ''; error.cat = ''
  let valid = true
  if (!form.sku.trim()) { error.sku = 'SKU is required'; valid = false }
  if (!form.name.trim()) { error.name = 'Name is required'; valid = false }
  if (!form.cat.trim()) { error.cat = 'Category is required'; valid = false }
  if (!valid) return

  const skuUp = form.sku.trim().toUpperCase()
  if (await skuExists(skuUp, isEdit.value ? props.editProduct.id : null)) {
    error.sku = 'SKU already exists'; return
  }

  if (isEdit.value) {
    await updateProduct(props.editProduct.id, {
      sku: skuUp, name: form.name.trim(), cat: form.cat.trim(),
      qty: Number(form.qty), reorder: Number(form.reorder),
      cost: Number(form.cost), sell: Number(form.sell), note: form.note.trim()
    })
  } else {
    const id = uid()
    const qty = Number(form.qty) || 0
    await addProduct({
      id, sku: skuUp, name: form.name.trim(), cat: form.cat.trim(),
      qty, reorder: Number(form.reorder), cost: Number(form.cost),
      sell: Number(form.sell), note: form.note.trim(),
      createdAt: new Date().toISOString()
    })
    if (qty > 0) {
      await addMovement({
        id: uid(), productId: id, productName: form.name.trim(),
        productSku: skuUp, type: 'in', qty,
        date: today(), note: 'Opening stock', by: ''
      })
    }
  }
  emit('close')
}
</script>

<template>
  <BaseModal :title="title" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">SKU / Item Code *</label>
      <input class="inp" v-model="form.sku" placeholder="e.g. SKU-001" style="text-transform:uppercase" />
      <div v-if="error.sku" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.sku }}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Product Name *</label>
      <input class="inp" v-model="form.name" list="catalog-names-list" placeholder="e.g. Wireless Keyboard"
        @change="onNameChange" @input="onNameChange" />
      <datalist id="catalog-names-list">
        <option v-for="n in catalogNames" :key="n" :value="n" />
      </datalist>
      <div v-if="error.name" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.name }}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Category *</label>
      <input class="inp" v-model="form.cat" list="cat-list" placeholder="e.g. Electronics" />
      <datalist id="cat-list">
        <option v-for="c in categories" :key="c" :value="c" />
      </datalist>
      <div v-if="error.cat" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.cat }}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">{{ isEdit ? 'Qty in Stock' : 'Initial Qty' }}</label>
        <input class="inp" type="number" min="0" v-model="form.qty" />
      </div>
      <div class="form-group">
        <label class="form-label">Reorder Level</label>
        <input class="inp" type="number" min="0" v-model="form.reorder" />
      </div>
      <div class="form-group">
        <label class="form-label">Cost Price ($)</label>
        <input class="inp" type="number" min="0" step="0.01" v-model="form.cost" />
      </div>
      <div class="form-group">
        <label class="form-label">Sell Price ($)</label>
        <input class="inp" type="number" min="0" step="0.01" v-model="form.sell" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Supplier / Notes</label>
      <input class="inp" v-model="form.note" placeholder="Optional" />
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
      <button class="btn" style="background:var(--surface2);color:var(--text)" @click="emit('close')">Cancel</button>
      <button class="btn btn-primary" @click="save">{{ isEdit ? 'Save Changes' : 'Add Product' }}</button>
    </div>
  </BaseModal>
</template>
