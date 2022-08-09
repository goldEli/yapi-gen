import { type IDomEditor } from '@wangeditor/editor'

export interface NewIDomEditor extends IDomEditor {
  changeEditor?(status: boolean, key?: string): void
}
