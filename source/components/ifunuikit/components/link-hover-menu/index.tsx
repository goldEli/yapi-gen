import type { Editor } from '@tiptap/core'
import type { ReactNode } from 'react'
import { HoverMenu } from '../editor-nodes/hover-menu/view'
import Content from './content'

type LinkHoverMenuProps = {
  editor?: Editor | null
  children?: ReactNode
  isDis?: boolean
}

const LinkHoverMenu = (props: LinkHoverMenuProps) => {
  const { editor, isDis } = props
  if (!editor) {
    return null
  }

  return (
    <HoverMenu
      editor={editor}
      tippyOptions={{ placement: 'bottom', zIndex: 400 }}
      shouldShow={() => editor.isActive('link')}
    >
      <Content isDis={isDis} editor={editor} />
    </HoverMenu>
  )
}

export default LinkHoverMenu
