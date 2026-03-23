<script setup lang="ts">
interface Props {
  hasFile: boolean
  exporting: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  upload: []
  export: []
}>()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-6">
      <div class="min-w-0">
        <p class="text-sm font-semibold text-slate-900">PDF Page Size Resizer</p>
        <p class="truncate text-xs text-slate-500">Resize PDF page dimensions locally in your browser</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="emit('upload')"
        >
          Upload PDF
        </button>
        <button
          class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          :disabled="!hasFile || exporting"
          @click="emit('export')"
        >
          {{ exporting ? 'Exporting...' : 'Export PDF' }}
        </button>
      </div>
    </div>
  </header>
</template>
