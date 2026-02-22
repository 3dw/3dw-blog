# CLAUDE.md

## Project Overview

**3dw-blog** is a VitePress-based blog that publishes transcripts and summaries of self-directed learning dialogues (自主學習對話錄). Content is in Traditional Chinese.

## Tech Stack

- **VitePress** `^2.0.0-alpha.16` — static site generator
- **Vue 3** — for interactive components within Markdown pages
- **markdown-it** — Markdown processing
- **Yarn 4** — package manager (`packageManager: yarn@4.9.1`)

## Project Structure

```
.
├── CLAUDE.md
├── README.md
├── package.json
├── yarn.lock
├── logo.png
├── .env.example          # template for optional env vars
├── .env                  # (gitignored) local env overrides
├── .vitepress/
│   ├── config.mts        # VitePress config: sidebar, nav, theme settings
│   └── theme/
│       ├── index.ts      # theme entry: registers global components
│       ├── style.css     # custom CSS
│       ├── env.d.ts      # TypeScript env declarations
│       ├── ai_summarize.ts           # AI summary fetch logic
│       └── components/
│           ├── AISummaryPanel.vue    # AI outline panel shown on post pages
│           └── SiteFooter.vue        # Global site footer
└── docs/
    ├── index.md          # Home page (lists posts dynamically via Vue)
    ├── markdown-examples.md
    ├── api-examples.md
    └── posts/            # Blog posts (Markdown with frontmatter)
        └── readme.md     # Example post
```

## Development Commands

```bash
yarn install    # install dependencies
yarn dev        # start dev server
yarn build      # build for production
yarn preview    # preview production build
```

## Adding Blog Posts

Create a `.md` file in `docs/posts/` with frontmatter:

```markdown
---
title: 文章標題
description: 簡短說明
date: YYYY-MM-DD
---
```

The sidebar and home page listing are generated automatically from frontmatter at build time (via `config.mts`).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUMMARIZE_ENDPOINT` | Optional | POST endpoint for AI summary. Accepts `{ text, pagePath }`, returns `{ text }`. Without this, the AI outline panel is hidden. |

Copy `.env.example` to `.env` and fill in values as needed.

## Architecture Notes

- **Config** (`config.mts`): reads all post frontmatter at build time to construct sidebar items and inject `VITE_SUMMARIZE_ENDPOINT` into the Vite build.
- **AI summary** (`ai_summarize.ts` + `AISummaryPanel.vue`): optional feature that calls a backend endpoint to summarize post content. Panel is hidden when `VITE_SUMMARIZE_ENDPOINT` is unset.
- **Home page** (`docs/index.md`): uses `import.meta.glob` to dynamically list posts sorted by date.
- **Git worktrees**: Claude Code uses worktrees under `.claude/worktrees/`. The main repo is at `/Users/bestian/Documents/GitHub/3dw-blog`.

## Licensing

- Code: MIT License
- Content in `docs/posts/`: CC-BY-SA-4.0
