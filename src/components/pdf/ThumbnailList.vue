<script setup lang="ts">
import ThumbnailItem from './ThumbnailItem.vue'
import type { PdfPageMeta } from '../../types/pdf'
import type { ResolvedPageSettings } from '../../types/page-setting'

interface Props {
  pages: PdfPageMeta[]
  selectedPage: number
  resolve: (page: PdfPageMeta) => ResolvedPageSettings
  inheritGlobalForPage: (pageNumber: number) => boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [pageNumber: number]
}>()
</script>

<template>
  <aside class="h-[calc(100vh-5rem)] overflow-y-auto pr-1">
    <div class="space-y-3">
      <ThumbnailItem
        v-for="item in pages"
        :key="item.pageNumber"
        :page="item"
        :selected="selectedPage === item.pageNumber"
        :resolved="resolve(item)"
        :inherit-global="inheritGlobalForPage(item.pageNumber)"
        @click="emit('select', item.pageNumber)"
      />
    </div>
  </aside>
</template>
