<script setup lang="ts">
import { computed } from 'vue'
import { pdfStore } from '../store/pdfStore'
import { PRESET_SIZES } from '../constants/preset-sizes'
import { fromPt, toPt, mmToPt } from '../utils/unit'
import type { Orientation, FitMode, SizeUnit } from '../types/page-setting'

const gs = computed(() => pdfStore.globalSettings)

const unitOptions: { label: string; value: SizeUnit }[] = [
  { label: 'mm', value: 'mm' },
  { label: 'in', value: 'in' },
  { label: 'pt', value: 'pt' },
]

const orientationOptions: { label: string; value: Orientation }[] = [
  { label: 'Follow original', value: 'follow' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
]

const fitModeOptions: { label: string; value: FitMode; desc: string }[] = [
  { label: 'Fit & Center', value: 'fit_center', desc: 'Scale to fit, centered' },
  { label: 'Fit Top', value: 'fit_top', desc: 'Scale to fit, top-aligned' },
  { label: 'Fill & Crop', value: 'fill_crop', desc: 'Fill page, may crop' },
  { label: 'Keep Original', value: 'keep_original', desc: 'Only resize page, no scaling' },
]

function getDisplayValue(pt: number): string {
  return fromPt(pt, gs.value.unit).toFixed(gs.value.unit === 'pt' ? 0 : 2)
}

function onPresetChange(e: Event) {
  const key = (e.target as HTMLSelectElement).value
  const preset = PRESET_SIZES.find(p => p.key === key)
  if (preset && key !== 'custom') {
    gs.value.presetKey = key
    gs.value.widthPt = mmToPt(preset.widthMm)
    gs.value.heightPt = mmToPt(preset.heightMm)
  } else {
    gs.value.presetKey = 'custom'
  }
}

function onWidthInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  if (!isNaN(val) && val > 0) {
    gs.value.widthPt = toPt(val, gs.value.unit)
    gs.value.presetKey = 'custom'
  }
}

function onHeightInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  if (!isNaN(val) && val > 0) {
    gs.value.heightPt = toPt(val, gs.value.unit)
    gs.value.presetKey = 'custom'
  }
}

function onMarginInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  if (!isNaN(val) && val >= 0) {
    gs.value.marginPt = toPt(val, gs.value.unit)
  }
}

function applyToAll() {
  pdfStore.applyGlobalToAll()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Global Settings</h3>
    </div>

    <!-- Preset -->
    <div class="space-y-1">
      <label class="text-xs font-medium text-gray-600">Paper Size</label>
      <select
        :value="gs.presetKey"
        @change="onPresetChange"
        class="w-full h-8 px-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option v-for="p in PRESET_SIZES" :key="p.key" :value="p.key">
          {{ p.label }}{{ p.key !== 'custom' ? ` (${p.widthMm}×${p.heightMm} mm)` : '' }}
        </option>
      </select>
    </div>

    <!-- Unit -->
    <div class="space-y-1">
      <label class="text-xs font-medium text-gray-600">Unit</label>
      <div class="flex gap-1">
        <button
          v-for="u in unitOptions"
          :key="u.value"
          @click="gs.unit = u.value"
          :class="[
            'flex-1 h-7 text-xs rounded-md border transition-colors font-medium',
            gs.unit === u.value
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          ]"
        >
          {{ u.label }}
        </button>
      </div>
    </div>

    <!-- Width / Height -->
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-1">
        <label class="text-xs font-medium text-gray-600">Width</label>
        <div class="relative">
          <input
            type="number"
            :value="getDisplayValue(gs.widthPt)"
            @change="onWidthInput"
            min="1"
            step="0.1"
            class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ gs.unit }}</span>
        </div>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium text-gray-600">Height</label>
        <div class="relative">
          <input
            type="number"
            :value="getDisplayValue(gs.heightPt)"
            @change="onHeightInput"
            min="1"
            step="0.1"
            class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ gs.unit }}</span>
        </div>
      </div>
    </div>

    <!-- Orientation -->
    <div class="space-y-1">
      <label class="text-xs font-medium text-gray-600">Orientation</label>
      <select
        v-model="gs.orientation"
        class="w-full h-8 px-2 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option v-for="o in orientationOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <!-- Fit Mode -->
    <div class="space-y-1">
      <label class="text-xs font-medium text-gray-600">Content Fit</label>
      <div class="space-y-1">
        <label
          v-for="m in fitModeOptions"
          :key="m.value"
          :class="[
            'flex items-start gap-2 p-2 rounded-md border cursor-pointer transition-colors',
            gs.mode === m.value
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          ]"
        >
          <input type="radio" :value="m.value" v-model="gs.mode" class="mt-0.5 accent-blue-600" />
          <div>
            <div class="text-xs font-medium text-gray-700">{{ m.label }}</div>
            <div class="text-[10px] text-gray-400">{{ m.desc }}</div>
          </div>
        </label>
      </div>
    </div>

    <!-- Margin -->
    <div class="space-y-1">
      <label class="text-xs font-medium text-gray-600">Margin</label>
      <div class="relative">
        <input
          type="number"
          :value="getDisplayValue(gs.marginPt)"
          @change="onMarginInput"
          min="0"
          step="0.5"
          class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ gs.unit }}</span>
      </div>
    </div>

    <!-- Apply to all -->
    <button
      @click="applyToAll"
      :disabled="!pdfStore.document"
      class="w-full h-8 text-xs font-medium text-blue-600 border border-blue-200 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Apply to All Pages
    </button>
  </div>
</template>
