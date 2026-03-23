<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  loading: boolean
  fileName: string
  fileSizeLabel: string
  pageCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  selectFile: [file: File]
}>()

const dragOver = ref(false)

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('selectFile', file)
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('selectFile', file)
  target.value = ''
}
</script>

<template>
  <section
    class="rounded-xl border border-dashed p-5 transition"
    :class="dragOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white'"
    @dragenter.prevent="dragOver = true"
    @dragover.prevent="dragOver = true"
    @dragleave.prevent="dragOver = false"
    @drop="onDrop"
  >
    <div class="flex flex-col gap-3">
      <p class="text-sm font-medium text-slate-900">Upload your PDF file</p>
      <p class="text-xs text-slate-500">Click to choose or drag and drop. Processing stays local in your browser.</p>
      <div class="flex items-center gap-3">
        <label class="inline-flex cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Select File
          <input type="file" class="hidden" accept="application/pdf" @change="onInput" />
        </label>
        <p class="text-xs text-slate-500" v-if="loading">Parsing PDF...</p>
      </div>
      <p v-if="fileName" class="text-xs text-slate-600">
        {{ fileName }} · {{ fileSizeLabel }} · {{ pageCount }} pages
      </p>
    </div>
  </section>
</template>
