<script setup lang="ts">
import { computed } from 'vue'
import { pdfStore } from '../store/pdfStore'
import { PRESET_SIZES } from '../constants/preset-sizes'
import { fromPt, toPt, mmToPt } from '../utils/unit'
import type { Orientation, FitMode } from '../types/page-setting'

const currentIndex = computed(() => pdfStore.selectedPageIndex)
const override = computed(() => pdfStore.pageOverrides[currentIndex.value])
const page = computed(() => pdfStore.currentPage)

const orientationOptions: { label: string; value: Orientation }[] = [
  { label: 'Follow original', value: 'follow' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
]

const fitModeOptions: { label: string; value: FitMode }[] = [
  { label: 'Fit & Center', value: 'fit_center' },
  { label: 'Fit Top', value: 'fit_top' },
  { label: 'Fill & Crop', value: 'fill_crop' },
  { label: 'Keep Original', value: 'keep_original' },
]

const unit = computed(() => override.value?.setting.unit ?? pdfStore.globalSettings.unit)

function getDisplayValue(pt: number): string {
  return fromPt(pt, unit.value).toFixed(unit.value === 'pt' ? 0 : 2)
}

function onPresetChange(e: Event) {
  const key = (e.target as HTMLSelectElement).value
  const preset = PRESET_SIZES.find(p => p.key === key)
  const ov = override.value
  if (!ov) return
  ov.inheritGlobal = false
  if (preset && key !== 'custom') {
    ov.setting.presetKey = key
    ov.setting.widthPt = mmToPt(preset.widthMm)
    ov.setting.heightPt = mmToPt(preset.heightMm)
  } else {
    ov.setting.presetKey = 'custom'
  }
}

function onWidthInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  const ov = override.value
  if (!ov || isNaN(val) || val <= 0) return
  ov.inheritGlobal = false
  ov.setting.widthPt = toPt(val, unit.value)
  ov.setting.presetKey = 'custom'
}

function onHeightInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  const ov = override.value
  if (!ov || isNaN(val) || val <= 0) return
  ov.inheritGlobal = false
  ov.setting.heightPt = toPt(val, unit.value)
  ov.setting.presetKey = 'custom'
}

function onMarginInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  const ov = override.value
  if (!ov || isNaN(val) || val < 0) return
  ov.inheritGlobal = false
  ov.setting.marginPt = toPt(val, unit.value)
}

function setInherit(inherit: boolean) {
  pdfStore.setPageInherit(currentIndex.value, inherit)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Page {{ page ? page.pageNumber : '–' }} Settings
      </h3>
    </div>

    <div v-if="!page" class="text-xs text-gray-400 py-4 text-center">No page selected</div>
    <div v-else-if="!override" class="text-xs text-gray-400 py-4 text-center">Loading...</div>
    <template v-else>
      <!-- Inherit toggle -->
      <div class="flex items-center justify-between p-2.5 rounded-md border border-gray-200 bg-gray-50">
        <div>
          <div class="text-xs font-medium text-gray-700">Inherit global settings</div>
          <div class="text-[10px] text-gray-400 mt-0.5">Use the global configuration for this page</div>
        </div>
        <button
          @click="setInherit(!override.inheritGlobal)"
          :class="[
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none',
            override.inheritGlobal ? 'bg-blue-500' : 'bg-gray-300'
          ]"
        >
          <span
            :class="[
              'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform',
              override.inheritGlobal ? 'translate-x-4.5' : 'translate-x-0.5'
            ]"
          ></span>
        </button>
      </div>

      <!-- Custom settings (shown when not inheriting) -->
      <div v-if="!override.inheritGlobal" class="space-y-3">
        <!-- Preset -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600">Paper Size</label>
          <select
            :value="override.setting.presetKey"
            @change="onPresetChange"
            class="w-full h-8 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="p in PRESET_SIZES" :key="p.key" :value="p.key">
              {{ p.label }}{{ p.key !== 'custom' ? ` (${p.widthMm}×${p.heightMm} mm)` : '' }}
            </option>
          </select>
        </div>

        <!-- Width / Height -->
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600">Width</label>
            <div class="relative">
              <input
                type="number"
                :value="getDisplayValue(override.setting.widthPt)"
                @change="onWidthInput"
                min="1"
                step="0.1"
                class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ unit }}</span>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-gray-600">Height</label>
            <div class="relative">
              <input
                type="number"
                :value="getDisplayValue(override.setting.heightPt)"
                @change="onHeightInput"
                min="1"
                step="0.1"
                class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ unit }}</span>
            </div>
          </div>
        </div>

        <!-- Orientation -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600">Orientation</label>
          <select
            v-model="override.setting.orientation"
            class="w-full h-8 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="o in orientationOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <!-- Fit Mode -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600">Content Fit</label>
          <select
            v-model="override.setting.mode"
            class="w-full h-8 px-2 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="m in fitModeOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>

        <!-- Margin -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600">Margin</label>
          <div class="relative">
            <input
              type="number"
              :value="getDisplayValue(override.setting.marginPt)"
              @change="onMarginInput"
              min="0"
              step="0.5"
              class="w-full h-8 px-2 pr-7 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ unit }}</span>
          </div>
        </div>

        <!-- Reset to global -->
        <button
          @click="setInherit(true)"
          class="w-full h-7 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset to Global Settings
        </button>
      </div>

      <!-- Inherited state display -->
      <div v-else class="space-y-2 text-xs text-gray-500">
        <div class="p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs">
          This page inherits global settings. Toggle off to customize.
        </div>
        <button
          @click="setInherit(false)"
          class="w-full h-7 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Customize This Page
        </button>
      </div>
    </template>
  </div>
</template>
