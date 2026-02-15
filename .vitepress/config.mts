import { readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

type FrontmatterMap = Record<string, string>
type SidebarPostItem = { text: string; link: string; date: string }

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(currentDir, '..')
const postsDir = resolve(currentDir, '../docs/posts')

/** 從專案根目錄載入 .env 中的 VITE_SUMMARIZE_ENDPOINT（確保 theme 能讀到） */
function loadSummarizeEndpoint(): string {
  try {
    const envPath = resolve(rootDir, '.env')
    const content = readFileSync(envPath, 'utf-8')
    const match = content.match(/^\s*VITE_SUMMARIZE_ENDPOINT\s*=\s*(.+)\s*$/m)
    if (match) {
      return match[1].replace(/^['"]|['"]$/g, '').trim()
    }
  } catch {
    // .env 不存在或讀取失敗則略過
  }
  return process.env.VITE_SUMMARIZE_ENDPOINT || ''
}

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '').trim()
}

function parseFrontmatter(content: string): FrontmatterMap {
  const blockMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!blockMatch) return {}

  const frontmatter: FrontmatterMap = {}
  for (const line of blockMatch[1].split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+)$/)
    if (!match) continue
    frontmatter[match[1]] = stripQuotes(match[2])
  }
  return frontmatter
}

const sidebarPostItems = readdirSync(postsDir)
  .filter((fileName) => extname(fileName) === '.md')
  .map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const source = readFileSync(resolve(postsDir, fileName), 'utf-8')
    const frontmatter = parseFrontmatter(source)
    return {
      text: frontmatter.title || slug,
      link: `/posts/${slug}`,
      date: frontmatter.date || ''
    } satisfies SidebarPostItem
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const latestPostLink = sidebarPostItems[0]?.link || '/posts/example'

const summarizeEndpoint = loadSummarizeEndpoint()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",

  vite: {
    define: {
      'import.meta.env.VITE_SUMMARIZE_ENDPOINT': JSON.stringify(summarizeEndpoint)
    }
  },

  title: "自主學習對話錄",
  description: "自主學習的親師生探索對話錄",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: '文章', link: latestPostLink },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '文章',
        items: sidebarPostItems.map(({ text, link }) => ({ text, link }))
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/3dw' },
      { icon: 'hackmd', link: 'https://g0v.hackmd.io/@bestian/ryCyzVAslx/https%3A%2F%2Fg0v.hackmd.io%2F%40jothon%2FS1mI_Bxhc' },
      { icon: 'slack', link: 'https://g0v-tw.slack.com/?redir=%2Farchives%2FC09GH7XK7HA%3Fname%3DC09GH7XK7HA' }
    ]
  }
})
