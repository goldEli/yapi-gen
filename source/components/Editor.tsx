import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import {
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig,
  i18nChangeLanguage,
} from '@wangeditor/editor'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { type NewIDomEditor } from './Editor/Editor'

interface Props {
  value: string
  onChangeValue(value: string): void
}

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'headerSelect',
    'bold',

    // 'italic',
    // 'underline',
    'color',
    'bgColor',
    'fontSize',

    // 'fontFamily',
    // 'indent',
    // 'delIndent',
    // 'insertLink',
    'bulletedList',
    'numberedList',
    'uploadImage',
    'justifyLeft',
    'justifyRight',
    'justifyCenter',

    // 'justifyJustify',
    'fullScreen',
  ],
}

const EditorBox = (props: Props) => {
  const [t, i18n] = useTranslation()
  const [key, setKey] = useState(1)
  const customParseLinkUrl = (url: string): string => {
    if (url.indexOf('http') !== 0) {
      return `http://${url}`
    }
    return url
  }
  const { uploadFile } = useModel('cos')
  const { userInfo } = useModel('user')
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [editConfig, setEditConfig] = useState(toolbarConfig)

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: t('components.pleaseContent'),
    hoverbarKeys: {
      image: {
        menuKeys: [
          'imageWidth30',
          'imageWidth50',
          'imageWidth100',
          'viewImageLink',
          'deleteImage',
        ],
      },
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
      uploadImage: {
        async customUpload(
          file: File,
          insert: (url: string, alt: string, src: string) => void,
        ) {
          const uploadedFile = await uploadFile(
            file,
            userInfo?.username,
            'richEditorFiles',
          )
          insert(uploadedFile.url, '', uploadedFile.url)
        },
      },
      insertLink: {
        parseLinkUrl: customParseLinkUrl,
      },
    },
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
    props.onChangeValue(e.getHtml())
  }

  return (
    <div style={{ border: '1px solid #EBEDF0', zIndex: 100, borderRadius: 6 }}>
      <Toolbar
        key={key}
        editor={editor}
        defaultConfig={editConfig}
        mode="default"
      />
      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={setEditor}
        onChange={onChange}
        mode="simple"
        key={key}
        style={{ height: 132, overflowY: 'hidden' }}
      />
    </div>
  )
}

export default EditorBox
