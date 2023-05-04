/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />
declare const __VERSION__: string

interface ImportMetaEnv {
  readonly __API_BASE_URL__: string
  readonly __SSO_URL__: string
  readonly __AES_IV__: string
  readonly __AES_KEY__: string
  readonly __COS_BUCKET__: string
  readonly __COS_REGION__: string
  readonly __COS_PREFIX__: string
  readonly __COS_SIGN_URL__: string
  readonly __COS_SIGN_ACCESS_TOKEN__: string
  readonly __COS_SIGN_APP_ID__: string
  readonly __COS_SIGN_BUCKET_ID__: string
  readonly __URL_HASH__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
