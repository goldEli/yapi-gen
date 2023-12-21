/* eslint-disable no-undefined */
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import View from './view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      insertVideo(options: {
        src?: string
        alt?: string
        title?: string
        width?: number
        height?: number
        loading?: boolean
        srcKey?: string
      }): ReturnType
    }
  }
}

export interface VideoOptions {
  inline: boolean
  // eslint-disable-next-line @typescript-eslint/naming-convention
  HTMLAttributes: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Video = Node.create<VideoOptions>({
  name: 'video',
  draggable: true,
  selectable: true,
  atom: false,
  isolating: false,
  allowGapCursor: true,
  inline() {
    return this.options.inline
  },
  group() {
    return this.options.inline ? 'inline' : 'block'
  },
  addOptions() {
    return {
      inline: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      HTMLAttributes: {},
    }
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
        tag: 'video',
      },
    ]
  },

  // eslint-disable-next-line @typescript-eslint/naming-convention
  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        contentEditable: true,
      }),
    ]
  },

  addCommands() {
    return {
      insertVideo:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  // eslint-disable-next-line new-cap
  addNodeView: () => ReactNodeViewRenderer(View),
})

export default Video
