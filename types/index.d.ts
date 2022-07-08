/// <reference types="vite/client" />

declare const VERSION: string

interface ImportMetaEnv {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly __APPLICATION_ID__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
