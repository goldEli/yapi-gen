/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { createContext, type PropsWithChildren } from 'react'

const locals = {
  zh: {
    fold: '收起',
    transfer: {
      full_uploading: '上传进行中',
      full_paused: '上传已暂停',
      full_error: '上传失败',
      full_success: '上传成功',
      checking: '准备中',
      uploading: '上传中',
      paused: '已暂停',
      error: '上传失败',
      success: '已成功',
      restartAll: '重新开始',
      continueAll: '全部继续',
      pausedAll: '全部暂停',
      spare: '剩余',
      item: '项',
      cancelUpload: '取消上传',
      confirmCancelUpload: '确认取消上传',
    },
    staffSelect: {
      createSpace: '创建空间',
      cancel: '取消',
      ok: '确定',
      searchContact: '搜索联系人',
      selectAll: '全选',
      checked: '已选',
      clear: '清除',
    },
  },
  en: {
    fold: 'fold',
    transfer: {
      full_uploading: 'uploading',
      full_paused: 'upload paused',
      full_error: 'upload failed',
      full_success: 'upload success',
      checking: 'preparing',
      uploading: 'uploading',
      paused: 'paused',
      error: 'failed',
      success: 'success',
      restartAll: 'restart all',
      continueAll: 'continue all',
      pausedAll: 'pause all',
      spare: 'spare',
      item: 'item',
      cancelUpload: 'cancel upload',
      confirmCancelUpload: 'confirm cancel upload',
    },
    staffSelect: {
      createSpace: 'Create space',
      cancel: 'Cancel',
      ok: 'Ok',
      searchContact: 'Search contact',
      selectAll: 'Select All',
      checked: 'selected',
      clear: 'clear',
    },
  },
}

export const Context = createContext<{
  local: keyof typeof locals
  locale: Record<string, any>
  language?: boolean
} | null>(null)

type ConfigProviderProps = PropsWithChildren<{
  local?: keyof typeof locals
  language?: boolean
}>

const ConfigProvider = (props: ConfigProviderProps) => {
  const local = props.local || 'zh'
  const locale = locals[local]
  return (
    <Context.Provider
      value={{
        local,
        locale,
        language: props.language,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default ConfigProvider
