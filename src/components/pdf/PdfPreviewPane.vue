<script setup lang="ts">
interface Props {
  image: string
  loading: boolean
  info: string
}

defineProps<Props>()
</script>

<template>
  <section class="flex h-[calc(100vh-11rem)] items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
    <div v-if="loading" class="w-full max-w-2xl animate-pulse rounded-lg border border-slate-200 bg-slate-100" style="height: 70%"></div>
    <div v-else-if="image" class="w-full text-center">
      <p class="mb-3 text-xs text-slate-500">{{ info }}</p>
      <img :src="image" class="mx-auto max-h-[72vh] rounded-lg border border-slate-200 shadow-sm" />
    </div>
    <div v-else class="text-center text-slate-500">
      <p class="text-sm font-medium">No preview yet</p>
      <p class="text-xs">Upload a PDF to begin.</p>
    </div>
  </section>
</template>
