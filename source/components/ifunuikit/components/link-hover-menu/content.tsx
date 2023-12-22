import { useRef } from 'react'
import { Editor } from '@tiptap/core'
import { getMarkRange, getMarkType } from '@tiptap/react'
import { TextSelection } from 'prosemirror-state'

import { TextSpan, TextSpanA, TextSpanRed, TextSpanWrap, Wrap } from './style'
import EditLinkDialog, { type EditLinkDialogRef } from '../edit-link-dialog'
import Icon from '../../assets/icons'
// import { useTranslation } from "react-i18next";

type LinkHoverMenuContentProps = {
  editor?: Editor | null
  isDis?: boolean
}

const Content = (props: LinkHoverMenuContentProps) => {
  // const [t] = useTranslation();

  const editLinkDialogRef = useRef<EditLinkDialogRef>()
  const { editor, isDis } = props
  if (!editor || !editor.isActive('link')) {
    return null
  }

  const type = getMarkType('link', editor.state.schema)
  const attrs = editor.state.selection.$from
    .marks()
    .find(i => i.type === type)?.attrs
  const href = attrs?.href || ''
  const range = getMarkRange(editor.state.selection.$from, type, attrs)
  let content = ''
  if (range) {
    const textSelection = TextSelection.create(
      editor.state.doc,
      range.from,
      range.to,
    )
    content = textSelection
      .content()
      .content.textBetween(0, textSelection.content().content.size)
  }

  // 弹出编辑对话框
  const onShowEditDialog = () =>
    range &&
    editLinkDialogRef.current?.show({
      content,
      href,
    })

  // 编辑链接
  const onEditLink = (formData: Record<string, any>) => {
    if (!range) {
      return
    }
    editor
      .chain()
      .setTextSelection(range)
      .insertContent(`<a href="${formData.href}">${formData.content}</a>`)
      .focus()
      .run()
  }

  // 取消链接
  const onUnsetLink = () => editor.chain().unsetLink().focus().run()
  if (isDis) {
    return null
  }

  return (
    <Wrap>
      <Icon type="link" size={20} />
      <a className={TextSpanA} href={href}>
        {content}
      </a>
      <div className={TextSpanWrap}>
        <TextSpan onClick={onShowEditDialog}>编辑</TextSpan>
        <TextSpan onClick={onUnsetLink}>取消链接</TextSpan>
        <TextSpanRed onClick={onUnsetLink}>删除</TextSpanRed>
      </div>

      <EditLinkDialog
        title="编辑"
        ref={editLinkDialogRef}
        onSubmit={onEditLink}
      />
    </Wrap>
  )
}

export default Content
