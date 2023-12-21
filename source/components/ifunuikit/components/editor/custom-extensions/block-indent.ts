import { Extension } from '@tiptap/core'

export interface BlockIndentOptions {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockIndent: {
      indent(): ReturnType
      outdent(): ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const BlockIndent = Extension.create<BlockIndentOptions>({
  name: 'blockIndent',

  addOptions() {
    return {
      types: ['paragraph'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          blockIndent: {
            default: 0,
            parseHTML: element =>
              Math.floor(Number(element.style.paddingLeft) / 32) || 0,
            renderHTML: attributes => {
              if (!attributes.blockIndent) {
                return {}
              }

              return { style: `padding-left: ${attributes.blockIndent * 32}px` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ commands, editor }) =>
          this.options.types.every(type =>
            commands.updateAttributes(type, {
              blockIndent: (editor.getAttributes(type).blockIndent || 0) + 1,
            }),
          ),

      outdent:
        () =>
        ({ commands, editor }) =>
          this.options.types.every(type => {
            const blockIndent =
              (editor.getAttributes(type).blockIndent || 0) - 1
            return commands.updateAttributes(type, {
              blockIndent: Math.max(0, blockIndent),
            })
          }),
    }
  },
})

export default BlockIndent
