/// <reference types="vite/client" />

declare const VERSION: string

interface ImportMetaEnv {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly __API_BASE_URL__: string
  readonly __SSO_URL__: string
  readonly __AES_IV__: string
  readonly __AES_KEY__: string
  readonly __COS_BUCKET__: string
  readonly __COS_REGION__: string
  readonly __COS_PREFIX__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
