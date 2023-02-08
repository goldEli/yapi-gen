/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undefined */
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Editor } from '@tinymce/tinymce-react'
import 'tinymce'
import 'tinymce/models/dom'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/table'
import 'tinymce/plugins/emoticons'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.min.css'
import editorText from '@/locals/editor.zh-Hans'
import { uploadFileByTask } from '@/services/cos'
import type { ITinyEvents } from '@tinymce/tinymce-react/lib/cjs/main/ts/Events'
import Viewer from 'react-viewer'
import { Modal } from 'antd'

declare global {
  interface Window {
    tinymce: any
  }
}

if (window.tinymce) {
  window.tinymce?.addI18n?.('zh-Hans', editorText)
}

const TinyEditor = (props: any, ref: ForwardedRef<any>) => {
  const editorRef = useRef<any>()
  const { i18n } = useTranslation()
  const [key, setKey] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const textWrapEditor = useRef<any>(null)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })

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
    textWrapEditor?.current?.addEventListener('click', (e: any) =>
      onGetViewPicture(e),
    )

    return textWrapEditor?.current?.removeEventListener('click', (e: any) =>
      onGetViewPicture(e),
    )
  }, [])

  const [valueInfo, setValueInfo] = useState('')

  // 对齐
  let activeAlign = ''
  const alignList = [
    { text: '左对齐', icon: 'align-left', key: 'JustifyLeft', value: false },
    {
      text: '居中对齐',
      icon: 'align-center',
      key: 'JustifyCenter',
      value: false,
    },
    { text: '右对齐', icon: 'align-right', key: 'JustifyRight', value: false },
    {
      text: '两端对齐',
      icon: 'align-justify',
      key: 'JustifyFull',
      value: false,
    },
  ]
  // 字体更多
  let activeFontMore = ''
  const fontMoreList = [
    { text: '斜体', icon: 'italic', key: 'Italic', value: false },
    {
      text: '删除线',
      icon: 'strike-through',
      key: 'Strikethrough',
      value: false,
    },
  ]

  // 缩进下拉
  let activeDent = ''
  const dentList = [
    { text: '增加缩进', icon: 'indent', key: 'Indent', value: false },
    {
      text: '减少缩进',
      icon: 'outdent',
      key: 'Outdent',
      value: false,
    },
  ]

  useImperativeHandle(
    ref,
    () => ({
      // 检测富文本编辑器是否初始化完成
      isInitialized() {
        return !!editorRef.current
      },
      // 向富文本内容动态插入图片到光标位置
      insertImage(url: string) {
        if (editorRef.current) {
          editorRef.current.insertContent(`<img src="${url}" alt="" />`)
        }
      },
    }),
    [],
  )

  useEffect(() => {
    setKey(oldKey => oldKey + 1)
  }, [i18n.language])

  const onInitHandler: ITinyEvents['onInit'] = (event, editor) => {
    editorRef.current = editor
    const container = document.querySelector('.tox-tinymce')
    const fullscreenButton = document.querySelector(
      `[aria-label="${i18n.language === 'en' ? 'Fullscreen' : '全屏'}"]`,
    )
    let isFullscreen = false
    fullscreenButton?.addEventListener('click', e => {
      e.preventDefault()
      isFullscreen = !isFullscreen
      if (isFullscreen) {
        container?.classList.add('.tox-fullscreen')
        fullscreenButton.setAttribute(
          'title',
          i18n.language === 'en' ? 'Cancel fullscreen' : '取消全屏',
        )
      } else {
        container?.classList.remove('.tox-fullscreen')
        fullscreenButton.setAttribute(
          'title',
          i18n.language === 'en' ? 'Fullscreen' : '全屏',
        )
      }
    })
  }

  const onChangeHandler = (value: string) => {
    const link = editorRef.current?.dom.select('a')
    setValueInfo(value)
    if (link) {
      link.forEach((item: any) => {
        item.addEventListener('click', (event: any) => {
          event.preventDefault()
          window.open((item as HTMLAnchorElement).getAttribute('href') || '')
        })
      })
    }
    if (value.includes('@')) {
      setIsVisible(true)
    }
    if (props.onChange) {
      props.onChange(value)
    }
  }

  const onCustomMenuItem = (
    editor: any,
    list: any[],
    check: string,
    onChange: (key: string) => void,
  ) => {
    const items: any = []
    list.forEach((i: any) => {
      i.value = check === i.key ? !i.value : false
      items.push({
        type: 'togglemenuitem',
        text: i.text,
        icon: i.icon,
        onAction: () => {
          onChange(i.key)
          editor.execCommand(i.key)
        },
        onSetup: (api: any) => {
          api?.setActive?.(i.key === check || i.value)
          return function () {
            //
          }
        },
      })
    })
    return items
  }

  return (
    <>
      {isVisible ? (
        <Viewer
          zIndex={9999}
          visible={isVisible}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setIsVisible(false)}
        />
      ) : null}
      <div
        ref={textWrapEditor}
        dangerouslySetInnerHTML={{ __html: valueInfo }}
      />
      {/* <Modal visible={isVisible}>dsdkjsdh</Modal> */}
      <Editor
        onInit={onInitHandler}
        key={key}
        value={props.value}
        onEditorChange={onChangeHandler}
        init={{
          height: 434,
          menubar: false,
          contextmenu: false,
          statusbar: false,
          link_title: false,
          skin: false,
          content_css: false,
          content_style: 'html,body{font-family:Microsoft YaHei;}',
          style_formats_merge: false,
          style_formats_autohide: true,
          plugins: ['fullscreen', 'link', 'lists', 'table', 'emoticons'],
          toolbar:
            'blocks fontsize | bold underline fontMore | forecolor backcolor removeformat |' +
            ' bullist numlist | alignButton dentMore lineheight | uploadImage uploadMedia table link emoticons blockquote | fullscreen',
          language: i18n.language === 'en' ? undefined : 'zh-Hans',
          language_load: false,
          image_title: false,
          automatic_uploads: true,
          paste_data_images: true,
          font_size_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
          forced_root_block: '',
          emoticons_database_url: '/emojis.js',
          // 上传粘贴的图片
          images_upload_handler: (blobInfo, success) => {
            return new Promise(resolve => {
              const file: any = blobInfo.blob()
              uploadFileByTask(
                file,
                file.name,
                `richEditorFiles_${new Date().getTime()}`,
              ).then((res: any) => {
                success(res.url)
                resolve(res.url)
              })
            })
          },
          setup: editor => {
            editor.ui.registry.addButton('uploadImage', {
              icon: 'image',
              tooltip: 'uploadImage',
              onAction: () => {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')
                input.addEventListener('change', async (e: Event) => {
                  const [file] = (e.target as HTMLInputElement)
                    .files as FileList
                  const response = await uploadFileByTask(
                    file,
                    file.name,
                    `richEditorFiles_${new Date().getTime()}`,
                  )
                  editor.insertContent(`<img src="${response.url}" />`)
                })
                input.click()
              },
            })
            editor.ui.registry.addButton('uploadMedia', {
              icon: 'embed',
              tooltip: 'uploadMedia',
              onAction: () => {
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'video/*')
                input.addEventListener('change', async (e: Event) => {
                  const [file] = (e.target as HTMLInputElement)
                    .files as FileList
                  const response = await uploadFileByTask(
                    file,
                    file.name,
                    `richEditorFiles_${new Date().getTime()}`,
                  )
                  editor.insertContent(`<video poster controls>
                  <source src="${response.url}" />
                </video>`)
                })
                input.click()
              },
            })
            editor.ui.registry.addMenuButton('alignButton', {
              icon: 'align-none',
              fetch: callback => {
                const items = onCustomMenuItem(
                  editor,
                  alignList,
                  activeAlign,
                  value => (activeAlign = value),
                )
                callback(items)
              },
            })
            editor.ui.registry.addMenuButton('fontMore', {
              icon: 'more-drawer',
              fetch: callback => {
                const items = onCustomMenuItem(
                  editor,
                  fontMoreList,
                  activeFontMore,
                  value => (activeFontMore = value),
                )
                callback(items)
              },
            })
            editor.ui.registry.addMenuButton('dentMore', {
              icon: 'toc',
              fetch: callback => {
                const items = onCustomMenuItem(
                  editor,
                  dentList,
                  activeDent,
                  value => (activeDent = value),
                )
                callback(items)
              },
            })
          },
        }}
      />
    </>
  )
}

export default forwardRef(TinyEditor)
