<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import FileUploadCard from './components/pdf/FileUploadCard.vue'
import ThumbnailList from './components/pdf/ThumbnailList.vue'
import PdfPreviewPane from './components/pdf/PdfPreviewPane.vue'
import GlobalSettingsPanel from './components/settings/GlobalSettingsPanel.vue'
import PageOverridePanel from './components/settings/PageOverridePanel.vue'
import EmptyState from './components/ui/EmptyState.vue'
import ExportToolbar from './components/app/ExportToolbar.vue'
import { usePdfLoader } from './composables/usePdfLoader'
import { usePdfPreview } from './composables/usePdfPreview'
import { usePageSettings } from './composables/usePageSettings'
import { usePdfExport } from './composables/usePdfExport'
import type { PdfDocumentState } from './types/pdf'
import type { UserPageSettings } from './types/page-setting'
import { formatPtAsMm } from './utils/pdf-size'

const pdfState = ref<PdfDocumentState | null>(null)
const selectedPage = ref(1)
const openFilePicker = ref<() => void>(() => undefined)

const { loading, error, loadPdf } = usePdfLoader()
const { previewLoading, previewError, renderPagePreview } = usePdfPreview()
const { exporting, progress, exportError, exportPdf } = usePdfExport()

const pagesGetter = () => pdfState.value?.pages ?? []
const {
  globalSettings,
  pageOverrides,
  resolvedSettings,
  initOverrides,
  applyPreset,
  ensureOverride,
  inheritPage,
  resolveForPage,
} = usePageSettings(pagesGetter)

const previewDataUrl = ref('')
const uiStatus = computed(() => {
  if (loading.value) return 'Parsing PDF'
  if (previewLoading.value) return 'Generating preview'
  if (exporting.value) return 'Exporting PDF'
  if (error.value || previewError.value || exportError.value) return 'Error'
  if (pdfState.value) return 'Ready'
  return 'Idle'
})

const fileSizeLabel = computed(() => {
  if (!pdfState.value) return ''
  return `${(pdfState.value.filesize / 1024 / 1024).toFixed(2)} MB`
})

const selectedOverride = computed(() => pageOverrides[selectedPage.value])
const selectedPageMeta = computed(() => pdfState.value?.pages.find((page) => page.pageNumber === selectedPage.value) ?? null)
const selectedPageInfo = computed(() => {
  if (!selectedPageMeta.value) return ''
  const resolved = resolveForPage(selectedPageMeta.value)
  return `Target ${formatPtAsMm(resolved.widthPt, resolved.heightPt)} · ${resolved.mode}`
})

const updateGlobal = (patch: Partial<UserPageSettings>) => {
  Object.assign(globalSettings, patch)
}

const updatePageOverride = (pageNumber: number, patch: Partial<UserPageSettings>) => {
  ensureOverride(pageNumber)
  const override = pageOverrides[pageNumber]
  if (!override?.overrideSettings) return
  Object.assign(override.overrideSettings, patch)
}

const applyPresetToPage = (pageNumber: number, presetKey: UserPageSettings['presetKey']) => {
  ensureOverride(pageNumber)
  const override = pageOverrides[pageNumber]
  if (!override?.overrideSettings) return
  applyPreset(override.overrideSettings, presetKey)
}

const applyAllPages = () => {
  Object.values(pageOverrides).forEach((item) => {
    item.inheritGlobal = true
    item.overrideSettings = null
  })
}

const inheritGlobalForPage = (pageNumber: number) => pageOverrides[pageNumber]?.inheritGlobal ?? true

const selectPage = async (pageNumber: number) => {
  selectedPage.value = pageNumber
  if (!pdfState.value) return
  previewDataUrl.value = await renderPagePreview(pdfState.value.fileBuffer, pageNumber)
}

const handleSelectFile = async (file: File) => {
  try {
    const parsed = await loadPdf(file)
    pdfState.value = reactive(parsed) as PdfDocumentState
    selectedPage.value = 1
    initOverrides()
    previewDataUrl.value = await renderPagePreview(parsed.fileBuffer, 1)
  } catch {
    // Error is already tracked via composable state.
  }
}

const handleExport = async () => {
  if (!pdfState.value) return
  await exportPdf(pdfState.value, resolvedSettings.value)
}

watch(
  () => [selectedPage.value, pdfState.value?.filename],
  async () => {
    if (!pdfState.value) return
    previewDataUrl.value = await renderPagePreview(pdfState.value.fileBuffer, selectedPage.value)
  },
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader :has-file="!!pdfState" :exporting="exporting" @upload="openFilePicker?.()" @export="handleExport" />

    <main class="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6">
      <FileUploadCard
        :loading="loading"
        :file-name="pdfState?.filename ?? ''"
        :file-size-label="fileSizeLabel"
        :page-count="pdfState?.pageCount ?? 0"
        @select-file="handleSelectFile"
      />

      <template v-if="pdfState">
        <section class="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
          <ThumbnailList
            :pages="pdfState.pages"
            :selected-page="selectedPage"
            :resolve="resolveForPage"
            :inherit-global-for-page="inheritGlobalForPage"
            @select="selectPage"
          />

          <PdfPreviewPane :image="previewDataUrl" :loading="previewLoading" :info="selectedPageInfo" />

          <aside class="h-[calc(100vh-5rem)] space-y-4 overflow-y-auto pr-1">
            <GlobalSettingsPanel
              :settings="globalSettings"
              @update="updateGlobal"
              @apply-all="applyAllPages"
              @apply-preset="(presetKey) => applyPreset(globalSettings, presetKey)"
            />
            <PageOverridePanel
              :page-number="selectedPage"
              :override="selectedOverride"
              @inherit="inheritPage"
              @enable-override="ensureOverride"
              @apply-preset="applyPresetToPage"
              @update="updatePageOverride"
            />
          </aside>
        </section>
      </template>
      <EmptyState v-else />

      <p v-if="error || previewError || exportError" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ error || previewError || exportError }}
      </p>

      <ExportToolbar :page-count="pdfState?.pageCount ?? 0" :status="uiStatus" :progress="progress" />
    </main>
  </div>
</template>
