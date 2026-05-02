<script setup>
import { ref } from 'vue'
import { useBackup } from '../../composables/useBackup'
import { useProducts } from '../../composables/useProducts'
import { useMovements } from '../../composables/useMovements'
import { useTransactions } from '../../composables/useTransactions'

const { exportData, importData }   = useBackup()
const { products }                 = useProducts()
const { movements }                = useMovements()
const { transactions }             = useTransactions()

// Export
const exporting = ref(false)
async function handleExport() {
  exporting.value = true
  try {
    await exportData()
  } finally {
    exporting.value = false
  }
}

// Import
const fileInput = ref(null)
const importing  = ref(false)
const progress   = ref(0)   // 0–100
const importMsg  = ref(null) // { type: 'success'|'error', text }
const dragOver   = ref(false)

function triggerFilePick() { fileInput.value?.click() }

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) runImport(file)
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) runImport(file)
}

async function runImport(file) {
  if (!file.name.endsWith('.json')) {
    importMsg.value = { type: 'error', text: 'Please select a .json backup file.' }
    return
  }

  const confirmed = confirm(
    'Importing will REPLACE all current data (products, movements, transactions).\n\nThis cannot be undone. Continue?'
  )
  if (!confirmed) return

  importing.value = true
  progress.value  = 0
  importMsg.value = null

  try {
    await importData(file, {
      onProgress: (done, total) => { progress.value = Math.round((done / total) * 100) }
    })
    // Reload the page so all composable singletons re-read fresh data from IndexedDB
    window.location.reload()
  } catch (err) {
    importMsg.value = { type: 'error', text: err.message }
    importing.value = false
    progress.value  = 0
  }
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div style="margin-bottom:28px">
      <div style="font-size:20px;font-weight:700">Admin</div>
      <div style="font-size:13px;color:var(--muted)">Backup & restore your StockVault data</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:860px">

      <!-- ── Export ── -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(0,184,122,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div>
            <div style="font-weight:700;font-size:15px">Export Backup</div>
            <div style="font-size:12px;color:var(--muted)">Download all data as JSON</div>
          </div>
        </div>

        <div style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:20px">
          Exports all products, stock movements, financial transactions, and settings into a single
          <strong style="color:var(--text)">.json</strong> file. Use this file to back up your data or
          transfer it to another device.
        </div>

        <!-- Stats -->
        <div style="display:flex;gap:10px;margin-bottom:20px">
          <div style="flex:1;background:var(--surface2);border-radius:8px;padding:10px 12px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--accent)">{{ products.length }}</div>
            <div style="font-size:11px;color:var(--muted)">Products</div>
          </div>
          <div style="flex:1;background:var(--surface2);border-radius:8px;padding:10px 12px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--accent3)">{{ movements.length }}</div>
            <div style="font-size:11px;color:var(--muted)">Movements</div>
          </div>
          <div style="flex:1;background:var(--surface2);border-radius:8px;padding:10px 12px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--accent2)">{{ transactions.length }}</div>
            <div style="font-size:11px;color:var(--muted)">Transactions</div>
          </div>
        </div>

        <button class="btn btn-primary" style="width:100%" :disabled="exporting" @click="handleExport">
          <span v-if="exporting">Preparing download…</span>
          <span v-else>⬇ Download Backup</span>
        </button>
      </div>

      <!-- ── Import ── -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(77,159,255,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent3)" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <div style="font-weight:700;font-size:15px">Import / Restore</div>
            <div style="font-size:12px;color:var(--muted)">Restore from a backup file</div>
          </div>
        </div>

        <div style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:20px">
          Select a <strong style="color:var(--text)">StockVault backup .json</strong> file to restore.
          <strong style="color:var(--danger)">This will replace all current data</strong> — make sure
          to export a backup first if needed.
        </div>

        <!-- Drop zone -->
        <div
          style="border:2px dashed var(--border);border-radius:10px;padding:28px 16px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:16px"
          :style="dragOver ? { borderColor: 'var(--accent3)', background: 'rgba(77,159,255,.06)' } : {}"
          @click="triggerFilePick"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="onDrop"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" style="margin:0 auto 10px">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="12" y2="12"/>
            <line x1="15" y1="15" x2="12" y2="12"/>
          </svg>
          <div style="font-size:13px;font-weight:600;color:var(--text)">Click or drag & drop</div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">stockvault-backup-*.json</div>
        </div>

        <input ref="fileInput" type="file" accept=".json" style="display:none" @change="onFileChange" />

        <!-- Progress bar -->
        <div v-if="importing" style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px">
            <span>Restoring…</span><span>{{ progress }}%</span>
          </div>
          <div style="background:var(--surface2);border-radius:4px;height:6px;overflow:hidden">
            <div style="height:100%;border-radius:4px;background:var(--accent3);transition:width .2s"
              :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- Result message -->
        <div v-if="importMsg" style="padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600"
          :style="importMsg.type === 'success'
            ? { background: 'rgba(0,184,122,.1)', color: 'var(--success)', border: '1px solid rgba(0,184,122,.25)' }
            : { background: 'rgba(255,71,87,.1)', color: 'var(--danger)',  border: '1px solid rgba(255,71,87,.25)' }">
          {{ importMsg.text }}
        </div>

        <button class="btn" style="width:100%;margin-top:14px;background:rgba(77,159,255,.12);color:var(--accent3)"
          :disabled="importing" @click="triggerFilePick">
          <span v-if="importing">Restoring…</span>
          <span v-else">⬆ Select Backup File</span>
        </button>
      </div>

    </div>

    <!-- Warning notice -->
    <div style="margin-top:24px;max-width:860px;padding:14px 18px;border-radius:10px;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.25);display:flex;gap:12px;align-items:flex-start">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" stroke-width="2.2" style="flex-shrink:0;margin-top:1px">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <div style="font-size:13px;color:var(--muted);line-height:1.6">
        <strong style="color:var(--warn)">Important:</strong> StockVault data is stored in your browser's IndexedDB.
        It is <strong style="color:var(--text)">not synced to the cloud</strong> and will be lost if you clear browser
        data. Export a backup regularly to avoid data loss.
      </div>
    </div>
  </div>
</template>
