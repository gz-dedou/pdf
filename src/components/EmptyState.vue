<script setup lang="ts">
const props = defineProps<{ onUpload: () => void }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full min-h-96 py-16 px-6">
    <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 class="text-base font-semibold text-gray-800 mb-1.5">No PDF loaded</h3>
    <p class="text-sm text-gray-500 mb-6 text-center max-w-xs">
      Upload a PDF file to get started. All processing happens locally in your browser.
    </p>
    <button
      @click="props.onUpload"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Upload PDF
    </button>
    <p class="mt-4 text-xs text-gray-400">Supports PDF files · Processed entirely in your browser</p>
  </div>
</template>
