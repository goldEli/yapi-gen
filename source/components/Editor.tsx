// 公用富文本

/* eslint-disable @typescript-eslint/naming-convention */
import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect, forwardRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import {
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig,
  i18nChangeLanguage,
  i18nAddResources,
  Boot,
} from '@wangeditor/editor'
import fullscreenMenu from './Editor/fullscreen'
import cancelfullscreenMenu from './Editor/cancelFullscreen'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { type NewIDomEditor } from './Editor/Editor'
import styled from '@emotion/styled'

interface Props {
  value?: string
  onChange?(value: string): void
  onChangeValue?(value: string): void
  height?: number
  placeholder?: any
  color?: boolean
  autoFocus?: boolean
}

const toolbarConfig: Partial<IToolbarConfig> = {}

Boot.registerParseElemHtml({
  selector: 'v-start',
  parseElemHtml: () => ({ type: 'v-start', children: [] }),
})

Boot.registerParseElemHtml({
  selector: 'v-end',
  parseElemHtml: () => ({ type: 'v-end', children: [] }),
})

Boot.registerMenu(fullscreenMenu)
Boot.registerMenu(cancelfullscreenMenu)

i18nAddResources('en', {
  fontSize: {
    default: 'Font size',
  },
  fontFamily: {
    default: 'Font family',
  },
})

const Wrap = styled.div<{ minHeight?: any; red?: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 6,
    border: '1px solid #ebedf0',
    zIndex: 100,
    marginLeft: '2px',
    padding: '1px',
    '.w-e-text-container [data-slate-editor] p': {
      margin: 0,
    },
    '.w-e-text-placeholder': {
      top: 0,
      fontStyle: 'inherit',
    },
    '&: hover': {
      borderRightWidth: 1,
      outline: 0,
      marginLeft: '2px',
    },
  },
  ({ minHeight }) => ({
    '.w-e-text-container [data-slate-editor]': {
      minHeight: minHeight || 120,
    },
  }),
  ({ red }) => ({
    borderColor: red ? 'red' : '',
  }),
)

const EditorBox = (props: Props) => {
  const [t, i18n] = useTranslation()
  const [key, setKey] = useState(1)
  const customParseLinkUrl = (url: string): string => {
    if (url.indexOf('http') !== 0) {
      return `http://${url}`
    }
    return url
  }
  const { uploadFileByTask } = useModel('cos')
  const { userInfo } = useModel('user')
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [editConfig, setEditConfig] = useState(toolbarConfig)

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

  useEffect(() => {
    if (editor) {
      const newEditor: NewIDomEditor = editor
      newEditor.changeEditor = changeEditor
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

  const onChange = (e: any) => {
    i18nChangeLanguage(i18n.language === 'zh' ? 'zh-CN' : i18n.language)
    props.onChangeValue?.(e.getHtml().trim())
    props.onChange?.(e.getHtml().trim())
  }

  return (
    <Wrap red={props.color} id="editorWrap" minHeight={props?.height}>
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
        style={{ flex: 1, overflowY: 'hidden' }}
      />
    </Wrap>
  )
}

export default forwardRef(EditorBox)
