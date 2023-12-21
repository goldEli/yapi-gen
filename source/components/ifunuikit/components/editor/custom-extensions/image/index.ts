/* eslint-disable no-undefined */
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import View from './view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      insertImage(options: {
        src?: string
        alt?: string
        title?: string
        width?: number
        height?: number
        loading?: boolean
        srcKey?: string
      }): ReturnType
      addImage(options: { src: string }): ReturnType
    }
  }
}

export interface ImageOptions {
  inline: boolean
  allowBase64: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  HTMLAttributes: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Image = Node.create<ImageOptions>({
  name: 'image',
  draggable: true,
  selectable: true,
  atom: false,
  isolating: false,
  allowGapCursor: true,
  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      HTMLAttributes: {},
    }
  },
  inline() {
    return this.options.inline
  },
  group() {
    return this.options.inline ? 'inline' : 'block'
  },
  addAttributes() {
    return {
      src: {
        default: undefined,
      },
      alt: {
        default: undefined,
      },
      title: {
        default: undefined,
      },
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
      loading: {
        default: undefined,
      },
      srcKey: {
        default: undefined,
      },
      progress: {
        default: undefined,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? 'img' : 'img:not([src^="data:"])',
      },
    ]
  },

  // eslint-disable-next-line @typescript-eslint/naming-convention
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        contentEditable: true,
      }),
    ]
  },

  addPasteRules() {
    return []
  },

  addCommands() {
    return {
      insertImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      addImage: options => {
        return ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        }
      },
    }
  },

  // eslint-disable-next-line new-cap
  addNodeView: () => ReactNodeViewRenderer(View),
})

export default Image
