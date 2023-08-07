/* eslint-disable max-statements-per-line */
/* eslint-disable require-unicode-regexp */
// 公用富文本
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/naming-convention */
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
import fullscreenMenu from './Editor/fullscreen'
import cancelfullscreenMenu from './Editor/cancelFullscreen'
import { useTranslation } from 'react-i18next'
import { type NewIDomEditor } from './Editor/Editor'
import styled from '@emotion/styled'
import { ChoosePerson } from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import { Popover, Tooltip } from 'antd'
import IconFont from './IconFont'
import Viewer from 'react-viewer'
import { uploadFileByTask } from '@/services/cos'
import { useSelector } from '@store/index'

interface Props {
  value?: string
  onChange?(value: string): void
  onChangeValue?(value: string): void
  height?: number
  placeholder?: any
  color?: boolean
  autoFocus?: boolean
  at?: boolean
  staffList?: any
  show?: boolean
  ref: any
}

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

const Wrap = styled.div<{ minHeight?: any; red?: boolean; show?: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 6,
    zIndex: 100,
    marginLeft: '2px',
    padding: '1px',
    '.w-e-text-container [data-slate-editor] p': {
      margin: 0,
    },
    img: {
      cursor: 'pointer !important',
    },
    '.w-e-text-placeholder': {
      top: 0,
      fontStyle: 'inherit',
    },
    '.w-e-bar-item button': {
      width: 'auto!important',
    },
    '&: hover': {
      borderRightWidth: 1,
      outline: 0,
      marginLeft: '2px',
    },
  },
  ({ minHeight }) => ({
    '.w-e-text-container [data-slate-editor]': {
      minHeight: minHeight || 0,
    },
  }),
  ({ red }) => ({
    borderColor: red ? 'red' : '',
  }),
  ({ show }) => ({
    border: show ? '1px solid transparent' : '1px solid #ebedf0 !important',
  }),
)
const GrepDiv = styled.div`
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 35px;
  display: inline-block;
  &:hover {
    background: #f1f1f1;
  }
`
const Hov = styled(IconFont)`
  & :focus {
    color: #2877ff;
  }
`

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
      const newEditor: NewIDomEditor = editor
      newEditor.changeEditor = changeEditor

      if (props.show) {
        editor.disable()
      }
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
    if (props.show) {
      textWrapEditor?.current?.addEventListener('click', (e: any) =>
        onGetViewPicture(e),
      )
    }

    return textWrapEditor?.current?.removeEventListener('click', (e: any) =>
      onGetViewPicture(e),
    )
  }, [])

  return (
    <Wrap
      show={props.show}
      red={props.color}
      id="editorWrap"
      minHeight={props?.height}
      ref={textWrapEditor}
    >
      {!props.show && (
        <Toolbar
          key={key}
          editor={editor}
          defaultConfig={editConfig}
          mode="default"
        />
      )}

      {props.at ? (
        <div
          style={{
            paddingLeft: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          <Popover
            style={{
              display: 'inline',
            }}
            key={isOpen.toString()}
            visible={isOpen}
            placement="bottomLeft"
            trigger="click"
            onVisibleChange={visible => setIsOpen(visible)}
            getTooltipContainer={node => node}
            content={
              isOpen ? (
                <ChoosePerson
                  onChangeValue={obj => onAddPerson(obj)}
                  options={props.staffList}
                  visible={isOpen}
                />
              ) : null
            }
            getPopupContainer={node => node}
          >
            <GrepDiv>
              <Tooltip
                overlayStyle={{
                  height: '27px',
                  fontSize: '12px',
                }}
                placement="bottom"
                getPopupContainer={node => node}
                title={t('new_p1.kongK')}
              >
                <Hov
                  style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: isOpen ? '#2877ff' : '#595959',
                  }}
                  type="mention"
                />
              </Tooltip>
            </GrepDiv>
          </Popover>
        </div>
      ) : null}

      {isVisible ? (
        <Viewer
          zIndex={9999}
          visible={isVisible}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setIsVisible(false)}
        />
      ) : null}

      <Editor
        defaultConfig={editorConfig}
        value={props.value}
        onCreated={(e: IDomEditor) => setEditor(e)}
        onChange={onChange}
        mode="simple"
        key={key}
        style={{ flex: 1 }}
      />
    </Wrap>
  )
}

export default forwardRef(EditorBox)
