/// <reference path="./env.d.ts" />
/** 摘要 API 端點，由 .env 的 VITE_SUMMARIZE_ENDPOINT 經 config 的 vite.define 注入 */
const SUMMARIZE_ENDPOINT = import.meta.env.VITE_SUMMARIZE_ENDPOINT ?? ''

export function getSummarizeEndpoint(): string {
  return SUMMARIZE_ENDPOINT
}

type SummarizeResponse = {
  text?: string
  error?: string
}

function normalizeText(input: string): string {
  return input.replace(/\n{3,}/g, '\n\n').trim()
}

export function collectPostText(): string {
  const doc = document.querySelector('.VPDoc .vp-doc')
  if (!doc) return ''
  const cloned = doc.cloneNode(true) as HTMLElement
  cloned.querySelectorAll('.ai-summary').forEach((node) => node.remove())
  return normalizeText(cloned.innerText || '')
}

export async function requestPostSummary(text: string, pagePath: string): Promise<string> {
  if (!SUMMARIZE_ENDPOINT) {
    throw new Error('未設定摘要服務端點（請設定環境變數 VITE_SUMMARIZE_ENDPOINT）')
  }
  const response = await fetch(SUMMARIZE_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ text, pagePath })
  })

  const data = (await response.json()) as SummarizeResponse

  if (!response.ok) {
    throw new Error(data.error || `摘要請求失敗（${response.status}）`)
  }

  if (!data.text?.trim()) {
    throw new Error('摘要服務沒有回傳內容')
  }

  return data.text.trim()
}
