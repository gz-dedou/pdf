<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { pdfStore } from '../store/pdfStore'
import { ptToMm } from '../utils/unit'
import { guessPaperName } from '../utils/pdf-size'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const props = defineProps<{ file: File | null }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isRendering = ref(false)
const previewError = ref<string | null>(null)

const currentPage = computed(() => pdfStore.currentPage)
const resolved = computed(() => {
  if (pdfStore.document === null) return null
  return pdfStore.resolvedSettingForPage(pdfStore.selectedPageIndex)
})

let renderTimer: ReturnType<typeof setTimeout> | null = null

async function renderPage() {
  if (!props.file || !currentPage.value) return

  if (renderTimer) {
    clearTimeout(renderTimer)
  }

  renderTimer = setTimeout(async () => {
    isRendering.value = true
    previewError.value = null
    try {
      const arrayBuffer = await props.file!.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdfDoc.getPage(pdfStore.selectedPageIndex + 1)
      const viewport = page.getViewport({ scale: 1.8 })

      const canvas = canvasRef.value
      if (!canvas) return

      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise
    } catch (err) {
      previewError.value = 'Failed to render preview'
      console.error(err)
    } finally {
      isRendering.value = false
    }
  }, 100)
}

watch(
  () => [props.file, pdfStore.selectedPageIndex],
  () => { renderPage() },
  { immediate: true }
)

const targetSizeLabel = computed(() => {
  if (!resolved.value) return ''
  const w = ptToMm(resolved.value.widthPt).toFixed(1)
  const h = ptToMm(resolved.value.heightPt).toFixed(1)
  return `${w} × ${h} mm`
})

const originalSizeLabel = computed(() => {
  if (!currentPage.value) return ''
  return guessPaperName(currentPage.value.originalWidthPt, currentPage.value.originalHeightPt)
})
</script>

<template>
  <main class="flex-1 flex flex-col items-center overflow-y-auto bg-gray-50 p-6">
    <div v-if="!file" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      No file loaded
    </div>
    <template v-else>
      <!-- Size info bar -->
      <div class="w-full max-w-lg mb-4 flex items-center justify-between text-xs text-gray-500">
        <span>Page {{ (pdfStore.selectedPageIndex + 1) }} / {{ pdfStore.document?.totalPages }}</span>
        <div class="flex items-center gap-2">
          <span class="text-gray-400">{{ originalSizeLabel }}</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-blue-600 font-medium">{{ targetSizeLabel }}</span>
        </div>
      </div>

      <!-- Preview area -->
      <div class="relative">
        <!-- Loading overlay -->
        <div v-if="isRendering" class="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
          <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Canvas container (paper effect) -->
        <div class="rounded-lg shadow-lg overflow-hidden bg-white border border-gray-200">
          <canvas ref="canvasRef" class="block max-w-full"></canvas>
        </div>

        <!-- Error state -->
        <div v-if="previewError" class="mt-3 text-sm text-red-500 text-center">{{ previewError }}</div>
      </div>
    </template>
  </main>
</template>
