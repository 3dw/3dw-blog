# 3dw-blog

以 VitePress 建置的部落格，存放公開的會議記錄、活動訊息、課程規畫。
`docs/posts` 中的文章會被自動轉換成[https://blog.alearn.org.tw](https://blog.alearn.org.tw)部落格中的網頁


## 授權

- **程式碼**：本專案程式碼採 [MIT License](LICENSE)。
- **內容**：`docs/posts` 內文章採 [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant)，詳見站台 footer。

## 參與編輯

近端開發，請先`pull` 再 `commit` 再 `push`，以避免版本衝突。

## 草稿

- **草稿共筆**：`draft` 內文章為草稿，不會呈現在網頁上。
- **線上編輯**：`draft` 內文章可在Github網站上直接用瀏覽器介面編輯，按`preview`可以切換預覽模式。(推薦新手使用瀏覽器編輯草稿)
- **線下編輯** 參見以下**開發**段落。
- **定稿後發佈**：參見以下**開發**段落。

## 開發

請先安裝 Yarn（建議 v4）：

```bash
npm install -g yarn
yarn --version  # 檢查版本，需為 4.x
```

```bash
yarn install
yarn dev
```

以上命令可以在`http://localhost:5173/`位置啟動本地伺服器，供瀏覽器開啟，以作為發佈前的預覽。

### 上稿流程

1. 將文章內容從`draft`移至`docs/posts`
2. 加入適當的metadata，含頭尾的三條線`---`，以及`title`, `description`, `date`欄位。 `date`欄位以`YYYY-MM-DD`格式

(⚠️請注意：若metadata格式有誤，該篇文章將無法正確呈現為網頁，請於發佈前確定預覽成功)

metadata格式與範例：

```bash

---
title: 0303首次會議記錄
description: 0303首次會議記錄
date: 2026-03-03
---

```






## 環境變數（本節為工程使用，可略過）

- **`VITE_SUMMARIZE_ENDPOINT`**：AI 摘要服務 API 端點。設為 POST 接受 `{ text, pagePath }` 並回傳 `{ text }` 的 URL。未設定時文章頁不會顯示「AI 大綱」區塊。可參考 `.env.example`。
