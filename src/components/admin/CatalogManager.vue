<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useCatalog } from '../../composables/useCatalog'
import { uid } from '../../utils/formatters'

const emit = defineEmits(['navigate'])

const { catalog, load, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useCatalog()

onMounted(load)

const catalogCategories = computed(() => [...new Set(catalog.value.map(c => c.cat).filter(Boolean))].sort())

// Form state
const showForm = ref(false)
const editingId = ref(null)
const form = reactive({ productNo: '', name: '', cat: '' })
const formError = reactive({ productNo: '', name: '', cat: '' })

function openAdd() {
  editingId.value = null
  form.productNo = ''
  form.name = ''
  form.cat = ''
  formError.productNo = ''
  formError.name = ''
  formError.cat = ''
  showForm.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.productNo = item.productNo || ''
  form.name = item.name
  form.cat = item.cat
  formError.productNo = ''
  formError.name = ''
  formError.cat = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function saveForm() {
  formError.productNo = ''
  formError.name = ''
  formError.cat = ''
  let valid = true
  if (!form.productNo.trim()) { formError.productNo = 'Product number is required'; valid = false }
  if (!form.name.trim()) { formError.name = 'Name is required'; valid = false }
  if (!form.cat.trim()) { formError.cat = 'Category is required'; valid = false }
  if (!valid) return

  if (editingId.value) {
    await updateCatalogItem(editingId.value, {
      productNo: form.productNo.trim(),
      name: form.name.trim(),
      cat: form.cat.trim()
    })
  } else {
    await addCatalogItem({
      id: uid(),
      productNo: form.productNo.trim(),
      name: form.name.trim(),
      cat: form.cat.trim()
    })
  }
  showForm.value = false
  editingId.value = null
}

async function remove(id) {
  if (!confirm('Delete this catalog item?')) return
  await deleteCatalogItem(id)
}
</script>

<template>
  <div style="margin-bottom:32px">
    <!-- Section header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:16px;font-weight:700">Product Catalog</div>
        <div style="font-size:13px;color:var(--muted)">Master list of product numbers, names and categories</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn" style="background:var(--surface2);color:var(--text);font-size:13px"
          @click="emit('navigate', 'inventory')">
          View Inventory →
        </button>
        <button class="btn btn-primary" style="font-size:13px" @click="openAdd">
          + Add Item
        </button>
      </div>
    </div>

    <!-- Add / Edit form -->
    <div v-if="showForm" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;margin-bottom:16px">
      <div style="font-size:14px;font-weight:600;margin-bottom:14px">
        {{ editingId ? 'Edit Catalog Item' : 'New Catalog Item' }}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Product Number *</label>
          <input class="inp" v-model="form.productNo" placeholder="e.g. PRD-001" />
          <div v-if="formError.productNo" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formError.productNo }}</div>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Product Name *</label>
          <input class="inp" v-model="form.name" placeholder="e.g. Wireless Keyboard" />
          <div v-if="formError.name" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formError.name }}</div>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Product Category *</label>
          <input class="inp" v-model="form.cat" list="catalog-cat-list" placeholder="e.g. Electronics" />
          <datalist id="catalog-cat-list">
            <option v-for="c in catalogCategories" :key="c" :value="c" />
          </datalist>
          <div v-if="formError.cat" style="color:var(--danger);font-size:12px;margin-top:4px">{{ formError.cat }}</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn" style="background:var(--surface2);color:var(--text)" @click="cancelForm">Cancel</button>
        <button class="btn btn-primary" @click="saveForm">{{ editingId ? 'Save Changes' : 'Add Item' }}</button>
      </div>
    </div>

    <!-- Catalog table -->
    <div class="card" style="overflow:hidden;padding:0">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--surface2);font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em">
            <th style="padding:10px 16px;text-align:left;font-weight:600">Product No.</th>
            <th style="padding:10px 16px;text-align:left;font-weight:600">Product Name</th>
            <th style="padding:10px 16px;text-align:left;font-weight:600">Category</th>
            <th style="padding:10px 16px;text-align:right;font-weight:600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="catalog.length === 0">
            <td colspan="4" style="padding:28px;text-align:center;color:var(--muted);font-size:13px">
              No catalog items yet — click <strong>+ Add Item</strong> to create one.
            </td>
          </tr>
          <tr v-for="item in catalog" :key="item.id"
            style="border-top:1px solid var(--border);font-size:13px">
            <td style="padding:10px 16px;color:var(--muted);font-family:monospace">{{ item.productNo }}</td>
            <td style="padding:10px 16px;font-weight:500">{{ item.name }}</td>
            <td style="padding:10px 16px;color:var(--muted)">{{ item.cat }}</td>
            <td style="padding:10px 16px;text-align:right">
              <button class="btn" style="padding:4px 10px;font-size:12px;background:var(--surface2);color:var(--text);margin-right:6px"
                @click="openEdit(item)">Edit</button>
              <button class="btn" style="padding:4px 10px;font-size:12px;background:rgba(255,71,87,.1);color:var(--danger)"
                @click="remove(item.id)">Del</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
