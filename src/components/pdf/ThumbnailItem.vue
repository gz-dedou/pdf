<script setup lang="ts">
import { formatPtAsMm, toPaperLabel } from '../../utils/pdf-size'
import type { PdfPageMeta } from '../../types/pdf'
import type { ResolvedPageSettings } from '../../types/page-setting'

interface Props {
  page: PdfPageMeta
  selected: boolean
  inheritGlobal: boolean
  resolved: ResolvedPageSettings
}

defineProps<Props>()
</script>

<template>
  <article
    class="cursor-pointer rounded-xl border bg-white p-3 shadow-xs transition hover:border-blue-300"
    :class="selected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'"
  >
    <div class="mb-2 flex items-center justify-between">
      <p class="text-xs font-semibold text-slate-900">Page {{ page.pageNumber }}</p>
      <span class="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
        {{ inheritGlobal ? 'Global' : 'Overridden' }}
      </span>
    </div>
    <img :src="page.thumbnailDataUrl" class="mb-2 h-36 w-full rounded border border-slate-200 object-contain bg-slate-50" />
    <div class="space-y-1 text-[11px] text-slate-500">
      <p>Original: {{ toPaperLabel(page.originalWidthPt, page.originalHeightPt) }} · {{ formatPtAsMm(page.originalWidthPt, page.originalHeightPt) }}</p>
      <p>Target: {{ formatPtAsMm(resolved.widthPt, resolved.heightPt) }}</p>
      <p>Mode: {{ resolved.mode }} · {{ resolved.orientation }}</p>
    </div>
  </article>
</template>
