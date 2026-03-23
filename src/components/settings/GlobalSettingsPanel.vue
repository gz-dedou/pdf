<script setup lang="ts">
import { PAGE_SIZE_PRESETS } from '../../constants/preset-sizes'
import type { UserPageSettings } from '../../types/page-setting'

interface Props {
  settings: UserPageSettings
}

defineProps<Props>()

const emit = defineEmits<{
  update: [patch: Partial<UserPageSettings>]
  applyAll: []
  applyPreset: [presetKey: UserPageSettings['presetKey']]
}>()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-900">Global Settings</h3>
      <button class="text-xs text-blue-600 hover:text-blue-700" @click="emit('applyAll')">Apply to all pages</button>
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs">
      <label class="col-span-2">
        <span class="mb-1 block text-slate-500">Preset</span>
        <select
          class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
          :value="settings.presetKey"
          @change="emit('applyPreset', ($event.target as HTMLSelectElement).value as UserPageSettings['presetKey'])"
        >
          <option v-for="preset in PAGE_SIZE_PRESETS" :key="preset.key" :value="preset.key">{{ preset.label }}</option>
        </select>
      </label>

      <label>
        <span class="mb-1 block text-slate-500">Width</span>
        <input type="number" min="1" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="settings.width" @input="emit('update', { width: Number(($event.target as HTMLInputElement).value), presetKey: 'Custom' })" />
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Height</span>
        <input type="number" min="1" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="settings.height" @input="emit('update', { height: Number(($event.target as HTMLInputElement).value), presetKey: 'Custom' })" />
      </label>

      <label>
        <span class="mb-1 block text-slate-500">Unit</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="settings.unit" @change="emit('update', { unit: ($event.target as HTMLSelectElement).value as UserPageSettings['unit'] })">
          <option value="mm">mm</option>
          <option value="in">in</option>
          <option value="pt">pt</option>
        </select>
      </label>
      <label>
        <span class="mb-1 block text-slate-500">Margin (mm)</span>
        <input type="number" min="0" class="w-full rounded-lg border border-slate-200 px-3 py-2" :value="settings.margin" @input="emit('update', { margin: Number(($event.target as HTMLInputElement).value) })" />
      </label>

      <label class="col-span-2">
        <span class="mb-1 block text-slate-500">Orientation</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="settings.orientation" @change="emit('update', { orientation: ($event.target as HTMLSelectElement).value as UserPageSettings['orientation'] })">
          <option value="follow_original">Follow original</option>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>

      <label class="col-span-2">
        <span class="mb-1 block text-slate-500">Content fit mode</span>
        <select class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2" :value="settings.mode" @change="emit('update', { mode: ($event.target as HTMLSelectElement).value as UserPageSettings['mode'] })">
          <option value="fit_center">fit_center</option>
          <option value="fit_top">fit_top</option>
          <option value="fill_crop">fill_crop</option>
          <option value="keep_original">keep_original</option>
        </select>
      </label>
    </div>
  </section>
</template>
