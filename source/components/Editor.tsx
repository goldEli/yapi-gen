import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor/editor'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

interface Props {
  value: string
  onChangeValue(value: string): void
}

const EditorBox = (props: Props) => {
  const [t] = useTranslation()
  const customParseLinkUrl = (url: string): string => {
    if (url.indexOf('http') !== 0) {
      return `http://${url}`
    }
    return url
  }
  const { uploadFile } = useModel('cos')
  const { userInfo } = useModel('user')
  const [editor, setEditor] = useState<IDomEditor | null>(null)
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

  useEffect(() => {
    return () => {
      if (editor === null) {
        return
      }
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const onChange = (e: any) => {
    props.onChangeValue(e.getHtml())
  }

  return (
    <div style={{ border: '1px solid #EBEDF0', zIndex: 100, borderRadius: 6 }}>
      <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" />
      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={setEditor}
        onChange={onChange}
        mode="default"
        style={{ height: 132, overflowY: 'hidden' }}
      />
    </div>
  )
}

export default EditorBox
