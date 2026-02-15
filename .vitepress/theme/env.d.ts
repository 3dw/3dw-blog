/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUMMARIZE_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
