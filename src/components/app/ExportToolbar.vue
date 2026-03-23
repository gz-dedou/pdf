<script setup lang="ts">
interface Props {
  pageCount: number
  status: string
  progress: number
}

defineProps<Props>()
</script>

<template>
  <footer class="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xs">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p>Total pages: <span class="font-medium text-slate-900">{{ pageCount }}</span></p>
      <p>Status: <span class="font-medium text-slate-900">{{ status }}</span></p>
      <p v-if="progress > 0">Export progress: <span class="font-medium text-slate-900">{{ progress }}%</span></p>
    </div>
  </footer>
</template>
