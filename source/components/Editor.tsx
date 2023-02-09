/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect, forwardRef, useRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import {
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig,
  i18nChangeLanguage,
  i18nAddResources,
  Boot,
} from '@wangeditor/editor'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import { uploadFileByTask } from '@/services/cos'

Boot.registerParseElemHtml({
  selector: 'v-start',
  parseElemHtml: () => ({ type: 'v-start', children: [] }),
})

Boot.registerParseElemHtml({
  selector: 'v-end',
  parseElemHtml: () => ({ type: 'v-end', children: [] }),
})

i18nAddResources('en', {
  fontSize: {
    default: 'Font size',
  },
  fontFamily: {
    default: 'Font family',
  },
})

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'underline',
    'italic',
    'through',
    'color',
    'bgColor',
    'fontSize',
    'fontFamily',
    'indent',
    'justifyCenter',
    'justifyJustify',
    'lineHeight',
    'viewImageLink',
    'emotion',
    'insertLink',
    'editLink',
    'unLink',
    'viewLink',
    'blockquote',
    'headerSelect',
    'todo',
    'redo',
    'undo',
    'enter',
    'bulletedList',
    'numberedList',
    'insertTable',
    'uploadVideo',
    'uploadImage',
    'fullScreen',
  ],
  excludeKeys: [],
}

interface Props {
  value?: string
  onChange?(value: string): void
  onChangeValue?(value: string): void
  height?: number
  placeholder?: any
  color?: boolean
  autoFocus?: boolean
  //   at?: boolean
  //   staffList?: any
  //   show?: boolean
  ref: any
}

const EditorBox = (props: Props) => {
  const textWrapEditor = useRef<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })

  const [t, i18n] = useTranslation()
  const [key, setKey] = useState(1)
  const customParseLinkUrl = (url: string): string => {
    if (url.indexOf('http') !== 0) {
      return `http://${url}`
    }
    return url
  }

  const { userInfo } = useSelector(store => store.user)
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [editConfig, setEditConfig] = useState(toolbarConfig)
  const [isOpen, setIsOpen] = useState(false)
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: props.placeholder ?? t('components.pleaseContent'),
    MENU_CONF: {
      fontFamily: {
        fontFamilyList: [
          '宋体',
          '黑体',
          '楷体',
          '幼圆',
          'Arial',
          'Arial Blank',
          'Times New Roman',
          'Verdana',
        ],
      },

      fontSize: {
        fontSizeList: ['12px', '16px', '40px'],
      },
      uploadImage: {
        async customUpload(
          file: File,
          insert: (url: string, alt: string, src: string) => void,
        ) {
          const uploadedFile = await uploadFileByTask(
            file,
            userInfo?.username,
            `richEditorFiles_${new Date().getTime()}`,
          )

          insert(uploadedFile.url, '', uploadedFile.url)
        },
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: any) {
          const uploadedFile = await uploadFileByTask(
            file,
            userInfo?.username,
            `richEditorFiles_${new Date().getTime()}`,
          )

          insertFn(uploadedFile.url, '', uploadedFile.url)
        },
      },
      insertLink: {
        parseLinkUrl: customParseLinkUrl,
      },
    },
    autoFocus: props.autoFocus,
  }

  editorConfig.customPaste = (
    e: IDomEditor,
    event: ClipboardEvent,
  ): boolean => {
    const text = event?.clipboardData?.getData('text/plain')

    // 获取粘贴的纯文本
    if (text) {
      e.insertText(text)

      // 阻止默认的粘贴行为
      event.preventDefault()
      return false
    }
    return true
  }

  const changeEditor = (bool = false, editorMenuKey?: string) => {
    setEditor(null)
    if (!bool) {
      if (editorMenuKey) {
        toolbarConfig.toolbarKeys?.pop()
        toolbarConfig.toolbarKeys?.push(editorMenuKey)
      }
      setEditConfig(toolbarConfig)
    }
    setKey(oldKey => oldKey + 1)
  }

  const getText = (str: string) => {
    return str
      .replace(/<[^<p>]+>/g, '')
      .replace(/<[</p>$]+>/g, '')
      .replace(/&nbsp;/gi, '')
      .replace(/<[^<br/>]+>/g, '')
  }

  const isNull = (str: string) => {
    if (str === '') {
      return true
    }
    const regu = '^[ ]+$'
    const re = new RegExp(regu)
    return re.test(str)
  }

  const onChange = (e: any) => {
    if (isNull(getText(e.getHtml()))) {
      props.onChangeValue?.('')
      props.onChange?.('')
    } else {
      i18nChangeLanguage(i18n.language === 'zh' ? 'zh-CN' : i18n.language)
      props.onChangeValue?.(e.getHtml().trim())
      props.onChange?.(e.getHtml().trim())
    }
  }

  const onChange2 = (e: any) => {
    const node = {
      text: `@${e}`,
      color: '#2877FF',
    }
    const node2 = {
      text: '  ',
    }
    editor?.insertNode(node)
    editor?.insertNode(node2)
  }

  const onAddPerson = (value: any) => {
    setIsOpen(false)

    const spanNode1 = document.createElement('span')
    const spanNode2 = document.createElement('span')
    spanNode1.style.color = '#2877FF'
    spanNode1.innerHTML = `@${value.name}`
    spanNode1.contentEditable = false as unknown as string
    spanNode1.setAttribute('data-userId', value.name)
    spanNode2.innerHTML = '&nbsp;'

    onChange2(value.name)
  }

  useEffect(() => {
    if (editor) {
      const newEditor: any = editor
      newEditor.changeEditor = changeEditor

      //   if (props.show) {
      //     editor.disable()
      //   }
    }
    i18n.on('languageChanged', () => {
      i18nChangeLanguage(i18n.language === 'zh' ? 'zh-CN' : i18n.language)
      changeEditor(true)
    })

    return () => {
      if (editor === null) {
        return
      }
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const onGetViewPicture = (e: any) => {
    if (e.target.nodeName === 'IMG') {
      const params: any = {}
      const oPics = textWrapEditor?.current?.getElementsByTagName('img')

      params.imageArray = []
      if (oPics) {
        for (const element of oPics) {
          params.imageArray.push({ src: element.src })
        }
        for (let i = 0; i < oPics.length; i++) {
          if (e.target.currentSrc === params.imageArray[i].src) {
            params.index = i
          }
        }
      }
      setIsVisible(true)
      setPictureList(params)
    }
  }

  useEffect(() => {
    // if (props.show) {
    textWrapEditor?.current?.addEventListener('click', (e: any) =>
      onGetViewPicture(e),
    )
    // }

    return textWrapEditor?.current?.removeEventListener('click', (e: any) =>
      onGetViewPicture(e),
    )
  }, [])

  return (
    <div ref={textWrapEditor}>
      <Toolbar
        key={key}
        editor={editor}
        defaultConfig={editConfig}
        mode="default"
      />

      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={(e: IDomEditor) => setEditor(e)}
        onChange={onChange}
        mode="simple"
        key={key}
        style={{ flex: 1 }}
      />
    </div>
  )
}

export default forwardRef(EditorBox)
