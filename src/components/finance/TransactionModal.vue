<script setup>
import { reactive, computed, watch } from 'vue'
import BaseModal from '../shared/BaseModal.vue'
import { useTransactions } from '../../composables/useTransactions'
import { TXN_CATS } from '../../utils/constants'
import { uid, today } from '../../utils/formatters'

const emit = defineEmits(['close'])
const { addTransaction } = useTransactions()

const form = reactive({ type: 'income', desc: '', cat: 'Product Sales', date: today(), amount: '' })
const error = reactive({ desc: '', amount: '' })

const cats = computed(() => TXN_CATS[form.type] || [])
watch(() => form.type, () => { form.cat = cats.value[0] })

async function save() {
  error.desc = ''; error.amount = ''
  let valid = true
  if (!form.desc.trim()) { error.desc = 'Description is required'; valid = false }
  const amt = parseFloat(form.amount)
  if (!amt || amt <= 0) { error.amount = 'Enter a valid amount'; valid = false }
  if (!valid) return

  await addTransaction({ id: uid(), type: form.type, desc: form.desc.trim(), cat: form.cat, date: form.date, amount: amt })
  emit('close')
}
</script>

<template>
  <BaseModal title="Add Transaction" @close="emit('close')">
    <div class="form-group">
      <label class="form-label">Type *</label>
      <select class="inp" v-model="form.type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Description *</label>
      <input class="inp" v-model="form.desc" placeholder="e.g. Office supplies" />
      <div v-if="error.desc" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.desc }}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select class="inp" v-model="form.cat">
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="inp" type="date" v-model="form.date" />
      </div>
      <div class="form-group">
        <label class="form-label">Amount ($) *</label>
        <input class="inp" type="number" min="0" step="0.01" v-model="form.amount" placeholder="0.00" />
        <div v-if="error.amount" style="color:var(--danger);font-size:12px;margin-top:4px">{{ error.amount }}</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
      <button class="btn" style="background:var(--surface2);color:var(--text)" @click="emit('close')">Cancel</button>
      <button class="btn btn-primary" @click="save">Add Transaction</button>
    </div>
  </BaseModal>
</template>
