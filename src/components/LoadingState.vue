<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full min-h-64 py-12">
    <div class="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p class="text-sm text-gray-600">{{ message ?? 'Loading...' }}</p>
  </div>
</template>
