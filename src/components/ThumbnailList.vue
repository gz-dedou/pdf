<script setup lang="ts">
import { computed } from 'vue'
import { pdfStore } from '../store/pdfStore'
import ThumbnailItem from './ThumbnailItem.vue'

const pages = computed(() => pdfStore.document?.pages ?? [])
const selectedIndex = computed(() => pdfStore.selectedPageIndex)

function selectPage(index: number) {
  pdfStore.selectedPageIndex = index
}
</script>

<template>
  <aside class="w-52 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
    <div class="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Pages
        <span v-if="pages.length" class="ml-1 text-gray-400 font-normal normal-case tracking-normal">({{ pages.length }})</span>
      </h2>
    </div>
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <ThumbnailItem
        v-for="(page, i) in pages"
        :key="page.pageNumber"
        :page="page"
        :index="i"
        :isSelected="selectedIndex === i"
        @select="selectPage"
      />
    </div>
  </aside>
</template>
