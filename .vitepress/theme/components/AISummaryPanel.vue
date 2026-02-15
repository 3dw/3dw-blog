<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { collectPostText, requestPostSummary } from '../ai_summarize'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

const route = useRoute()
const loading = ref(false)
const loaded = ref(false)
const errorMessage = ref('')
const summaryMarkdown = ref('')
const autoRequested = ref(false)

const enableAutoRequest = true
const isPostPage = computed(() => route.path.startsWith('/posts/'))
const summaryHtml = computed(() => md.render(normalizeSummaryMarkdown(summaryMarkdown.value)))

function normalizeSummaryMarkdown(input: string): string {
  return input.replace(/<br\s*\/?>/gi, '\n\n')
}

function resetState() {
  loading.value = false
  loaded.value = false
  errorMessage.value = ''
  summaryMarkdown.value = ''
  autoRequested.value = false
}

async function requestSummary() {
  if (loading.value || !isPostPage.value) return

  await nextTick()
  errorMessage.value = ''
  const text = collectPostText()
  if (!text) {
    errorMessage.value = '找不到文章內容，請重新整理後再試。'
    return
  }

  loading.value = true
  try {
    summaryMarkdown.value = await requestPostSummary(text, route.path)
    loaded.value = true
  } catch (error) {
    const message = error instanceof Error ? error.message : '摘要失敗，請稍後再試。'
    errorMessage.value = message
  } finally {
    loading.value = false
  }
}

async function requestSummaryOnce() {
  if (autoRequested.value || loading.value || loaded.value || !isPostPage.value) return
  autoRequested.value = true
  await requestSummary()
}

watch(
  () => route.path,
  async () => {
    resetState()
    if (enableAutoRequest) {
      await nextTick()
      void requestSummaryOnce()
    }
  }
)

onMounted(() => {
  if (enableAutoRequest) {
    void requestSummaryOnce()
  }
})
</script>

<template>
  <section v-if="isPostPage" class="ai-summary">
    <div class="ai-summary__head">
      <h2 class="ai-summary__title">AI 大綱</h2>
    </div>

    <p class="ai-summary__meta">模型：GPT-OSS-120b</p>

    <template v-if="errorMessage">
      <p class="ai-summary__error">{{ errorMessage }}</p>
      <button class="ai-summary__retry" type="button" :disabled="loading" @click="requestSummary">
        重試摘要
      </button>
    </template>
    <div v-else-if="loading" class="ai-summary__loading" role="status" aria-live="polite">
      <span class="ai-summary__spinner" aria-hidden="true" />
      <span>正在向摘要服務請求內容，請稍候...</span>
    </div>
    <div v-else-if="loaded" class="vp-doc ai-summary__content" v-html="summaryHtml" />
    <p v-else class="ai-summary__hint">正在準備摘要...</p>
  </section>
</template>
