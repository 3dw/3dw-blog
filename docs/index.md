---
# https://vitepress.dev/reference/default-theme-home-page
---

# 歡迎來到自主學習對話錄

這裡是記錄自主學習的親師生探索對話錄的網站。

## 關於

我們會將會議和對話的逐字稿，依序放入此部落格中，並附上簡單的摘要。


## 最新文章

<script setup>
const rawPosts = import.meta.glob('./posts/*.md', { eager: true })

const posts = Object.entries(rawPosts)
  .map(([path, mod]) => {
    const frontmatter = mod.__pageData?.frontmatter || {}
    const slug = path.replace('./posts/', '').replace(/\.md$/, '')
    return {
      url: `/posts/${slug}`,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      description: frontmatter.description || ''
    }
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

function formatDate(dateString) {
  if (!dateString) return '日期未知'
  if (dateString.includes('T')) return dateString.split('T')[0]
  return dateString
}
</script>


<ul class="post-list">
  <li v-for="post in posts" :key="post.url" class="post-item">
    <a :href="post.url">{{ post.title }}</a>
    <span class="meta">（{{ formatDate(post.date) }}）</span>
    <p v-if="post.description" class="desc">{{ post.description }}</p>
  </li>
</ul>

<style scoped>
.post-list {
  list-style: none;
  padding-left: 0;
}

.post-item {
  margin-bottom: 1rem;
}

.meta,
.desc {
  color: var(--vp-c-text-2);
}

.desc {
  margin: 0.25rem 0 0;
}
</style>

