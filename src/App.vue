<script setup lang="ts">
import { ref, computed } from 'vue'
import { pdfStore } from './store/pdfStore'
import { usePdfLoader } from './composables/usePdfLoader'
import { usePdfExport } from './composables/usePdfExport'
import AppHeader from './components/AppHeader.vue'
import ThumbnailList from './components/ThumbnailList.vue'
import PdfPreviewPane from './components/PdfPreviewPane.vue'
import GlobalSettingsPanel from './components/GlobalSettingsPanel.vue'
import PageOverridePanel from './components/PageOverridePanel.vue'
import EmptyState from './components/EmptyState.vue'
import LoadingState from './components/LoadingState.vue'

const { loadPdf } = usePdfLoader()
const { exportPdf } = usePdfExport()

const uploadedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const hasFile = computed(() => pdfStore.document !== null)

function openFilePicker() {
  fileInputRef.value?.click()
}

async function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await processFile(file)
}

async function processFile(file: File) {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    alert('Please select a valid PDF file.')
    return
  }
  uploadedFile.value = file
  await loadPdf(file)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) await processFile(file)
}

async function handleExport() {
  if (uploadedFile.value) {
    await exportPdf(uploadedFile.value)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,application/pdf"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Header -->
    <AppHeader
      :onUpload="openFilePicker"
      :onExport="handleExport"
      :hasFile="hasFile"
    />

    <!-- Main content -->
    <div
      class="flex flex-1 overflow-hidden"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <!-- Drag overlay -->
      <div
        v-if="isDragging"
        class="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-400 pointer-events-none"
      >
        <div class="bg-white rounded-xl shadow-lg px-8 py-6 text-center">
          <svg class="w-10 h-10 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p class="text-sm font-medium text-gray-700">Drop your PDF here</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="pdfStore.isLoading" class="flex-1 flex items-center justify-center">
        <LoadingState message="Loading PDF..." />
      </div>

      <!-- Empty state -->
      <div v-else-if="!hasFile" class="flex-1 flex items-center justify-center">
        <EmptyState :onUpload="openFilePicker" />
      </div>

      <!-- Main layout with file -->
      <template v-else>
        <!-- Left: Thumbnail list -->
        <ThumbnailList />

        <!-- Center: Preview -->
        <PdfPreviewPane :file="uploadedFile" />

        <!-- Right: Settings -->
        <aside class="w-72 flex-shrink-0 flex flex-col border-l border-gray-200 bg-white overflow-y-auto">
          <div class="p-4 space-y-4 flex-1">
            <!-- Global Settings card -->
            <div class="rounded-lg border border-gray-200 bg-white p-4">
              <GlobalSettingsPanel />
            </div>

            <!-- Page Override card -->
            <div class="rounded-lg border border-gray-200 bg-white p-4">
              <PageOverridePanel />
            </div>
          </div>

          <!-- Footer status -->
          <div class="border-t border-gray-100 px-4 py-3 bg-gray-50 flex-shrink-0">
            <div class="text-[10px] text-gray-400 space-y-0.5">
              <div>{{ pdfStore.document?.totalPages ?? 0 }} pages · {{ pdfStore.document?.filename }}</div>
              <div>All processing done locally in browser</div>
            </div>
          </div>
        </aside>
      </template>
    </div>

    <!-- Error toast -->
    <div
      v-if="pdfStore.loadError || pdfStore.exportError"
      class="fixed bottom-4 right-4 z-50 bg-red-600 text-white text-sm rounded-lg shadow-lg px-4 py-3 max-w-xs"
    >
      {{ pdfStore.loadError ?? pdfStore.exportError }}
    </div>
  </div>
</template>
