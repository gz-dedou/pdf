<script setup lang="ts">
import { PAGE_SIZE_PRESETS } from '../../constants/preset-sizes'
import type { PageOverrideState, UserPageSettings } from '../../types/page-setting'

interface Props {
  pageNumber: number
  override: PageOverrideState | undefined
}

defineProps<Props>()

const emit = defineEmits<{
  inherit: [pageNumber: number]
  enableOverride: [pageNumber: number]
  applyPreset: [pageNumber: number, presetKey: UserPageSettings['presetKey']]
  update: [pageNumber: number, patch: Partial<UserPageSettings>]
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-900">Page Override · #{{ pageNumber }}</h3>
      <button class="text-xs text-blue-600 hover:text-blue-700" @click="emit('inherit', pageNumber)">Restore inherit</button>
    </div>

    <label class="mb-3 flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs">
      <span class="text-slate-600">Inherit global settings</span>
      <input type="checkbox" :checked="override?.inheritGlobal ?? true" @change="($event.target as HTMLInputElement).checked ? emit('inherit', pageNumber) : emit('enableOverride', pageNumber)" />
    </label>

    <div v-if="override && !override.inheritGlobal && override.overrideSettings" class="grid grid-cols-2 gap-3 text-xs">
      <label class="col-span-2">
        <span class="mb-1 block text-slate-500">Preset</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="override.overrideSettings.presetKey" @change="emit('applyPreset', pageNumber, ($event.target as HTMLSelectElement).value as UserPageSettings['presetKey'])">
          <option v-for="preset in PAGE_SIZE_PRESETS" :key="preset.key" :value="preset.key">{{ preset.label }}</option>
        </select>
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Width</span>
        <input type="number" min="1" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="override.overrideSettings.width" @input="emit('update', pageNumber, { width: Number(($event.target as HTMLInputElement).value), presetKey: 'Custom' })" />
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Height</span>
        <input type="number" min="1" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="override.overrideSettings.height" @input="emit('update', pageNumber, { height: Number(($event.target as HTMLInputElement).value), presetKey: 'Custom' })" />
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Orientation</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="override.overrideSettings.orientation" @change="emit('update', pageNumber, { orientation: ($event.target as HTMLSelectElement).value as UserPageSettings['orientation'] })">
          <option value="follow_original">Follow</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Mode</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="override.overrideSettings.mode" @change="emit('update', pageNumber, { mode: ($event.target as HTMLSelectElement).value as UserPageSettings['mode'] })">
          <option value="fit_center">fit_center</option>
          <option value="fit_top">fit_top</option>
          <option value="fill_crop">fill_crop</option>
          <option value="keep_original">keep_original</option>
        </select>
      </label>
      <label class="col-span-2">
        <span class="mb-1 block text-slate-500">Margin (mm)</span>
        <input type="number" min="0" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="override.overrideSettings.margin" @input="emit('update', pageNumber, { margin: Number(($event.target as HTMLInputElement).value) })" />
      </label>
    </div>
  </section>
</template>
