# 3dw-blog

以 VitePress 建置的部落格。

## 授權

- **程式碼**：本專案程式碼採 [MIT License](LICENSE)。
- **內容**：`docs/posts` 內文章採 [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant)，詳見站台 footer。

## 開發

```bash
yarn install
yarn dev
```

## 環境變數（選填）

- **`VITE_SUMMARIZE_ENDPOINT`**：AI 摘要服務 API 端點。設為 POST 接受 `{ text, pagePath }` 並回傳 `{ text }` 的 URL。未設定時文章頁不會顯示「AI 大綱」區塊。可參考 `.env.example`。
