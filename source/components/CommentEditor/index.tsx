/* eslint-disable require-unicode-regexp */
import { removeNull } from '@/tools'
import { useSelector } from '@store/index'
import { Editor, EditorRef } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'

interface CommentEditorProps {
  item: any
  onEditComment(value: string): void
}

const CommentEditor = (props: CommentEditorProps) => {
  const editorRef = useRef<EditorRef>(null)
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const { projectInfoValues } = useSelector(store => store.project)
  const editorRef2 = useRef<any>()
  // 富文本失焦
  const onBlurEditor = async () => {
    props.onEditComment(editorRef2.current)
    setIsEditInfo(false)
  }

  // 只读编辑
  const onReadonlyClick = () => {
    setIsEditInfo(true)
    setTimeout(() => {
      editorRef.current?.focus()
    }, 10)
  }

  useEffect(() => {
    if (props.item.id) {
      setEditInfo(
        /(?<start>^<p>*)|(?<end><\p>*$)/g.test(props.item.content)
          ? props.item.content
          : `<p>${props.item.content}</p>`,
      )
      if (props.item.isEdit) {
        onReadonlyClick()
      }
    }
  }, [props.item])

  return (
    <Editor
      upload={uploadFile}
      at
      ref={editorRef}
      value={editInfo}
      getSuggestions={() => {
        return removeNull(projectInfoValues, 'user_name')?.map((k: any) => ({
          label: k.content,
          id: k.id,
        }))
      }}
      readonly={!isEditInfo}
      onReadonlyClick={() => onReadonlyClick()}
      onChange={(value: string) => (editorRef2.current = value)}
      onBlur={() => onBlurEditor()}
    />
  )
}

export default CommentEditor
