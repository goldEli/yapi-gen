/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
import { Extension } from '@tiptap/core'

import { HoverMenuPlugin, HoverMenuPluginProps } from './plugin'

export type HoverMenuOptions = Omit<
  HoverMenuPluginProps,
  'editor' | 'element'
> & {
  element: HTMLElement | null
}

export const HoverMenu = Extension.create<HoverMenuOptions>({
  name: 'hoverMenu',

  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: 'hoverMenu',
      shouldShow: null,
    }
  },

  addProseMirrorPlugins() {
    if (!this.options.element) {
      return []
    }

    return [
      HoverMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow,
      }),
    ]
  },
})
