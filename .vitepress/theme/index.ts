// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AISummaryPanel from './components/AISummaryPanel.vue'
import SiteFooter from './components/SiteFooter.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(AISummaryPanel),
      'layout-bottom': () => h(SiteFooter)
    })
  }
} satisfies Theme
