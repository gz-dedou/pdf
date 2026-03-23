<script setup lang="ts">
import { computed } from 'vue'
import { pdfStore } from '../store/pdfStore'
import type { PdfPageInfo } from '../types/pdf'
import { ptToMm } from '../utils/unit'
import { guessPaperName } from '../utils/pdf-size'

const props = defineProps<{
  page: PdfPageInfo
  index: number
  isSelected: boolean
}>()

const emit = defineEmits<{ select: [index: number] }>()

const override = computed(() => pdfStore.pageOverrides[props.index])
const resolved = computed(() => pdfStore.resolvedSettingForPage(props.index))

const originalLabel = computed(() => guessPaperName(props.page.originalWidthPt, props.page.originalHeightPt))

const targetLabel = computed(() => {
  const w = ptToMm(resolved.value.widthPt).toFixed(0)
  const h = ptToMm(resolved.value.heightPt).toFixed(0)
  return `${w}×${h} mm`
})

const isOverridden = computed(() => override.value && !override.value.inheritGlobal)
</script>

<template>
  <div
    @click="emit('select', props.index)"
    :class="[
      'group cursor-pointer rounded-lg border transition-all p-2.5 select-none',
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-sm'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    ]"
  >
    <!-- Thumbnail image -->
    <div class="relative bg-gray-100 rounded overflow-hidden mb-2 flex items-center justify-center" style="min-height: 80px;">
      <img
        v-if="page.thumbnailDataUrl"
        :src="page.thumbnailDataUrl"
        :alt="`Page ${page.pageNumber}`"
        class="max-w-full max-h-32 object-contain shadow-sm"
      />
      <div v-else class="w-full h-20 flex items-center justify-center text-gray-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6M7 7h10M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H7z" />
        </svg>
      </div>
      <!-- Override badge -->
      <div v-if="isOverridden" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" title="Custom size"></div>
    </div>

    <!-- Page info -->
    <div class="space-y-0.5">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-700">Page {{ page.pageNumber }}</span>
        <span v-if="isOverridden" class="text-[10px] text-amber-600 font-medium">Custom</span>
      </div>
      <div class="text-[10px] text-gray-400 truncate">{{ originalLabel }}</div>
      <div class="text-[10px] text-blue-600 font-medium truncate">→ {{ targetLabel }}</div>
    </div>
  </div>
</template>
