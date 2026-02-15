const SUMMARIZE_ENDPOINT =
  'https://blog-summarize.alearn13994229.workers.dev/api/summarize'

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
