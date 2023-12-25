/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undefined */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-duplicate-imports */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import { CSSProperties, MutableRefObject, useContext } from 'react'
import { useState } from 'react'
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'
import Viewer from 'react-viewer'
import { type Editor as EditorCore } from '@tiptap/core'
import { useEditor, BubbleMenu, type EditorEvents } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
// import BubbleMenu from '@tiptap/extension-bubble-menu'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import FloatingMenu2 from '@tiptap/extension-floating-menu'
import GapCursor from '@tiptap/extension-gapcursor'
import DropCursor from '@tiptap/extension-dropcursor'
import History from '@tiptap/extension-history'
import Mention from '@tiptap/extension-mention'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import FontSize from './custom-extensions/font-size'
import LineHeight from './custom-extensions/line-height'
import BlockIndent from './custom-extensions/block-indent'
import Image from './custom-extensions/image'
import Video from './custom-extensions/video'
import ActionBar from './action-bar'
import { StyledEditorContent, Wrap } from './style'
import suggestionOptions from './suggestion-options'
import LinkHoverMenu from '../link-hover-menu'
import WordTableContextMenu from '../word-table-context-menu'
import Placeholder from '@tiptap/extension-placeholder'
import { useContextMenu } from 'react-contexify'
// import { changeLanguage } from '../../locals'
import { Context } from '../config-provider'
import CharacterCount from '@tiptap/extension-character-count'
import { createPortal } from 'react-dom'
import { create } from 'zustand'
import BubbleMenuContent from './BubbleMenuContent'

const extensions = [
  Link,
  Document,
  Paragraph,
  Heading,
  // BubbleMenu,
  BulletList.extend({
    addKeyboardShortcuts() {
      return {
        Tab: editor => {
          this.editor
            .chain()
            .sinkListItem('listItem')
            .command(({ tr }) => {
              tr.insertText('  ')
              return true
            })
            .run()
          return true
        },
      }
    },
  }),
  OrderedList,
  ListItem,
  TaskList,

  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: true,
    lastColumnResizable: false,
    allowTableNodeSelection: true,
  }),
  TableCell,
  TableHeader,
  TableRow,
  Blockquote,
  Text,
  Link,
  Underline,
  Strike,
  Bold,
  Italic,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  FontFamily,
  FontSize,
  LineHeight,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  BlockIndent,
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Video.configure({
    inline: true,
  }),
  FloatingMenu2,
  GapCursor,
  History,
  DropCursor.configure({
    width: 2,
  }),
]

export interface EditorRef {
  focus(): void
  past(url: string): void
  notifyUploading(key: string, progress: number): void
  notifyUploaded(key: string, url: string): void
  setContent(content: string): void
}

interface Props {
  limit?: number
  color?: string
  language?: boolean
  onReadonlyClick?(): void
  onPressEnter?(): void
  onBlur?(): void
  maxHeight?: string
  minHeight?: string
  height?: string
  at?: boolean
  focusState?: boolean
  placeholder?: string
  readonly?: boolean
  value?: string
  onChange?(value?: string): void
  upload?(
    file: File,
    editorRef?: EditorRef | null,
    key?: string,
  ): Promise<string> | string
  disableUpdateValue?: boolean
  getSuggestions?(params: { query: string; editor: EditorCore }):
    | Promise<
        {
          id: string
          label: ReactNode
        }[]
      >
    | {
        id: string
        label: ReactNode
      }[]
}

export const useEditorStore = create<{
  isFullscreen: boolean
  setIsFullscreen(isFullscreen: boolean): void
}>(set => {
  return {
    isFullscreen: false,
    setIsFullscreen(isFullscreen) {
      set({ isFullscreen })
    },
  }
})

const Editor = (props: Props, ref: React.ForwardedRef<EditorRef>) => {
  const value = useContext(Context)
  const editorViewRef = useRef<any>()
  const id = useRef(Math.floor(Math.random() * 100 + 1))
  const { show } = useContextMenu({
    id: id.current,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [focus, setFocus] = useState(false)
  // const [isFullscreen, setIsFullscreen] = useState(false)
  const { isFullscreen, setIsFullscreen } = useEditorStore()
  const valueRef = useRef(props.value || '')

  const editor = useEditor({
    extensions: extensions.concat(
      props.limit
        ? CharacterCount.configure({
            limit: props.limit,
          })
        : [],
      props.at
        ? Mention.configure({
            suggestion: {
              ...suggestionOptions,
              items: props.getSuggestions,
            },
          })
        : [],
      Placeholder.configure({
        placeholder: props.placeholder,
      }),
    ),
    content: props.value,
  })

  const localRef: MutableRefObject<EditorRef | null> = useRef(null)
  localRef.current = {
    focus() {
      editor?.view.focus()
    },
    past(url: string) {
      editor
        ?.chain()
        .insertImage({
          src: url,
        })
        .run()
    },
    notifyUploading(key, progress) {
      const editorCopy: any = editor
      editorCopy?.emit('file_uploading', { key, progress })
    },
    notifyUploaded(key, url) {
      const editorCopy: any = editor
      editorCopy?.emit('file_uploaded', { key, url })
    },
    setContent(content: string) {
      const editorCopy = editor
      editorCopy?.commands.setContent(content)
    },
  }
  useLayoutEffect(() => {
    if (
      !props.disableUpdateValue &&
      props.value &&
      valueRef.current !== props.value
    ) {
      localRef.current?.setContent(props.value)
    }
  }, [props.value])

  useImperativeHandle(ref, () => localRef.current!, [editor])

  const onUpdate = (event: EditorEvents['update']) => {
    const html = event.editor.getHTML()
    props.onChange?.(html)
    valueRef.current = html
  }

  useEffect(() => {
    if (props.readonly) {
      editor?.setEditable(false)
    } else {
      editor?.setEditable(true)
    }
    if (props.focusState) {
      editor?.view.focus()
    }
    if (editor) {
      editor?.on('update', onUpdate)
    }
    return () => {
      editor?.off('update', onUpdate)
    }
  }, [editor, props.readonly])

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!(event.target as HTMLElement).closest('td,th')) {
      return
    }
    show({ event })
  }
  const handleInnerClick = () => {
    // 处理元素内部点击事件逻辑
  }

  const handleOuterClick = () => {
    // 处理元素外部点击事件逻辑
    props.onBlur?.()
  }
  useEffect(() => {
    const handleDocumentClick = (event: any) => {
      if (
        editorViewRef?.current &&
        editorViewRef?.current.contains(event.target)
      ) {
        // 元素内部点击

        handleInnerClick()
      } else {
        // 元素外部点击
        setFocus(false)
        if (props.readonly) return
        handleOuterClick()
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [props.readonly])

  const onUpload = (file: File, key?: string) =>
    props.upload?.(file, localRef.current, key)

  function getImages(string?: string) {
    const imgRex = /<img.*?src="(.*?)"[^>]+>/g
    const images = []
    let img
    while ((img = imgRex.exec(string as string))) {
      images.push(img[1])
    }
    return images
  }

  const onDoubleClickImage = (e: any) => {
    const data = editor?.getHTML()
    const oPics = getImages(data)
    const params: any = {}
    params.imageArray = []

    // props.onPreviewImage()
    oPics.forEach(i => {
      params.imageArray.push({ src: i })
    })
    for (let i = 0; i < oPics.length; i++) {
      if (e.src === oPics[i]) {
        params.index = i
      }
    }
    setIsVisible(true)
    setPictureList(params)
  }
  // useEffect(() => {
  //   changeLanguage(value?.language ? 'en' : 'zh')
  // }, [value?.language])
  useEffect(() => {
    if (editor) {
      editor.on('double_click_image' as any, onDoubleClickImage)
    }

    return () => {
      editor?.off('double_click_image' as any, onDoubleClickImage)
    }
  }, [editor])

  if (!editor) {
    return null
  }
  const onPaste = async (e: any) => {
    if (!(e.clipboardData && e.clipboardData.items)) {
      alert('结束')
      return
    }
    const data = e.clipboardData.items
    if (data && data.length) {
      const item: any = data[0]

      // 判断是文本还是图片文件
      if (item.kind === 'file') {
        // message.warning('不支持复制上传图片，请通过上方菜单形式上传图片')

        // 获取文件
        const file = item.getAsFile()
        onUpload(file, 'copy')
      }
    }
    e.preventDefault()
  }

  const focusUserName = () => {
    setFocus(true)
  }
  const blurUserName = () => {
    setFocus(false)

    // props.onBlur?.()
  }
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // 在这里处理回车事件的逻辑
      props.onPressEnter?.()
    }
  }
  const style: CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 200,
        borderRadius: '0px',
      }
    : {}
    
  const ele = (
    <Wrap
      height={props.height}
      style={style}
      color={isFullscreen ? '' : props?.color}
      focus={focus}
      read={props.readonly}
      id="myEditor"
      ref={editorViewRef}
    >
      {!props.readonly && (
        <ActionBar
          // changeFull={e => {
          //   setIsFullscreen(e)
          // }}
          editor={editor}
          upload={onUpload}
          editorViewRef={editorViewRef}
        />
      )}
      {!props.readonly && editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <BubbleMenuContent>
            <ActionBar
              // changeFull={e => {
              //   setIsFullscreen(e)
              // }}
              editor={editor}
              upload={onUpload}
              editorViewRef={editorViewRef}
              include={[
                'content_level',
                'bold',
                'underline',
                'text_color',
                'text_background',
                'list',
                'clear',
              ]}
            />
          </BubbleMenuContent>
        </BubbleMenu>
      )}
      <StyledEditorContent
        maxHeight={isFullscreen ? '' : props.maxHeight}
        minHeight={props.minHeight}
        onKeyDown={onKeyDown}
        onContextMenu={onContextMenu}
        onFocus={focusUserName}
        onPaste={onPaste}
        onClick={() => {
          editor?.view.focus()
          if (props.readonly) {
            props.onReadonlyClick?.()
          }
        }}
        editor={editor}
        spellCheck="false"
      />
      <LinkHoverMenu isDis={props.readonly} editor={editor} />

      <WordTableContextMenu id={id.current} editor={editor} />
      {isVisible ? (
        <Viewer
          zIndex={9999}
          visible={isVisible}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setIsVisible(false)}
          onMaskClick={e => {
            setIsVisible(false)
          }}
        />
      ) : null}
    </Wrap>
  )

  return <>{isFullscreen ? createPortal(ele, document.body) : ele}</>
}

export default forwardRef(Editor)
