import { mergeAttributes, type Editor } from '@tiptap/react'
import pickFiles from '../../utils/pick-files'

const useActions = (editor?: Editor | null) => {
  const focus = () => editor?.chain().focus().run()
  const insertUploadingImages = (
    images?: {
      key: string
      width: number
      height: number
    }[],
  ) => {
    images?.forEach(i =>
      editor
        ?.chain()
        .insertImage({
          loading: true,
          srcKey: i.key,
          width: i.width,
          height: i.height,
        })
        .run(),
    )
  }
  const insertUploadingVideos = (
    images?: {
      key: string
      width: number
      height: number
    }[],
  ) => {
    images?.forEach(i =>
      editor
        ?.chain()
        .insertVideo({
          loading: true,
          srcKey: i.key,
          width: i.width,
          height: i.height,
        })
        .run(),
    )
  }

  const setBlockLevel = (level: number) => {
    const ddd = mergeAttributes(
      editor?.getAttributes('heading') || {},
      editor?.getAttributes('paragraph') || {},
      { level: Number(level) },
    )

    if (level > 0) {
      editor?.chain().focus().setNode('heading', ddd).run()
    } else {
      editor
        ?.chain()
        .focus()
        .setNode(
          'paragraph',
          mergeAttributes(editor?.getAttributes('heading') || {}),
        )
        .run()
    }
  }

  const insertTable = (rowLength: number, columnLength: number) =>
    editor
      ?.chain()
      .focus()
      .insertTable({
        rows: rowLength,
        cols: columnLength,
        withHeaderRow: false,
      })
      .run()

  const toggleBold = () => editor?.chain().toggleBold().focus().run()
  const toggleUnderline = () => editor?.chain().toggleUnderline().focus().run()
  const toggleStrike = () => editor?.chain().toggleStrike().focus().run()
  const toggleItalic = () => editor?.chain().toggleItalic().focus().run()
  const clear = () => editor?.chain().clearNodes().unsetAllMarks().focus().run()
  const indent = () => editor?.chain().indent().focus().run()
  const outdent = () => editor?.chain().outdent().focus().run()
  const setTextSize = (size: string) =>
    editor?.chain().setFontSize(size).focus().run()
  const toggleList = () => editor?.chain().toggleBulletList().focus().run()
  const toggleOrderedList = () =>
    editor?.chain().toggleOrderedList().focus().run()
  const setTextAlign = (align: string) =>
    editor?.chain().setTextAlign(align).focus().run()
  const setLineHeight = (level: number) =>
    editor?.chain().setLineHeight(level).focus().run()
  const toggleBlockquote = () =>
    editor?.chain().toggleBlockquote().focus().run()
  const insertContent = (content: string) =>
    editor?.chain().insertContent(content).focus().run()
  const setLink = (href: string) =>
    editor?.chain().setLink({ href }).focus().run()
  const setTextColor = (color: string) =>
    editor?.chain().setColor(color).focus().run()
  const setTextBackground = (color: string) =>
    editor?.chain().setHighlight({ color }).focus().run()

  return {
    focus,
    insertUploadingImages,
    insertUploadingVideos,
    toggleBold,
    toggleUnderline,
    toggleStrike,
    toggleItalic,
    clear,
    indent,
    outdent,
    insertTable,
    setTextSize,
    toggleList,
    toggleOrderedList,
    setTextAlign,
    setLineHeight,
    setBlockLevel,
    insertContent,
    toggleBlockquote,
    setLink,
    setTextColor,
    setTextBackground,
  }
}

export default useActions
