import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
  types: string[]
  defaultLineHeight: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight(level: number): ReturnType
      unsetLineHeight(): ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      defaultLineHeight: 1,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element =>
              Number(element.style.lineHeight) ||
              this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }

              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (alignment: number) =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.updateAttributes(type, { lineHeight: alignment }),
          )
        },

      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every(type =>
            commands.resetAttributes(type, 'lineHeight'),
          )
        },
    }
  },
})

export default LineHeight
