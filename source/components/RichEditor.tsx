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
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.min.css'
import editorText from '@/locals/editor.zh-Hans'
import { uploadFileByTask } from '@/services/cos'
import type { ITinyEvents } from '@tinymce/tinymce-react/lib/cjs/main/ts/Events'

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
  let alignState = {
    leftState: false,
    centerState: false,
    rightState: false,
    justifyState: false,
  }

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
    if (link) {
      link.forEach((item: any) => {
        item.addEventListener('click', (event: any) => {
          event.preventDefault()
          window.open((item as HTMLAnchorElement).getAttribute('href') || '')
        })
      })
    }
    if (props.onChange) {
      props.onChange(value)
    }
  }

  // const onCustomMenuItem = (
  //   editor: any,
  //   value: {
  //     text: string
  //     icon: string
  //     key: any
  //     checkedValue: string
  //   },
  // ) => {
  //   const item = {
  //     type: 'togglemenuitem',
  //     text: value.text,
  //     icon: value.icon,
  //     onAction: function () {
  //       // alignState = {
  //       //   leftState: !alignState.leftState,
  //       //   centerState: false,
  //       //   rightState: false,
  //       //   justifyState: false,
  //       // }
  //       Object.keys(alignState)?.forEach((i: any) => {
  //         alignState[value.key] =
  //           i === value.key ? !alignState[value.key] : false
  //       })
  //       editor.execCommand(value.checkedValue)
  //     },
  //     onSetup: function (api: any) {
  //       api?.setActive?.(!alignState[value.key])
  //       return function () {
  //         //
  //       }
  //     },
  //   }
  //   return item
  // }

  return (
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
        plugins: ['fullscreen', 'link', 'lists', 'image', 'table'],
        toolbar:
          'undo redo | blocks fontsize fontfamily | bold italic underline forecolor backcolor | link uploadImage hahaha fullscreen uploadMedia table mybutton | bullist numlist indent outdent aligncenter alignright alignjustify',
        font_family_formats:
          'Microsoft YaHei;宋体;黑体;楷体;幼圆;Arial;Verdana',
        language: i18n.language === 'en' ? undefined : 'zh-Hans',
        language_load: false,
        image_title: false,
        automatic_uploads: true,
        paste_data_images: true,
        font_size_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
        forced_root_block: '',
        setup: editor => {
          editor.ui.registry.addButton('uploadImage', {
            icon: 'image',
            tooltip: 'uploadImage',
            onAction: () => {
              const input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.setAttribute('accept', 'image/*')
              input.addEventListener('change', async (e: Event) => {
                const [file] = (e.target as HTMLInputElement).files as FileList
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
                const [file] = (e.target as HTMLInputElement).files as FileList
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
          // 在下拉菜单按钮中使用上面注册的2个菜单项
          editor.ui.registry.addMenuButton('mybutton', {
            icon: 'align-none',
            fetch: function (callback) {
              const items: any = [
                // onCustomMenuItem(editor, {
                //   icon: 'align-left',
                //   text: '左对齐',
                //   checkedValue: 'JustifyLeft',
                //   key: 'leftState',
                // }),

                {
                  type: 'togglemenuitem',
                  text: '左对齐',
                  icon: 'align-left',
                  onAction: function () {
                    alignState = {
                      leftState: !alignState.leftState,
                      centerState: false,
                      rightState: false,
                      justifyState: false,
                    }
                    editor.execCommand('JustifyLeft')
                  },
                  onSetup: function (api: any) {
                    api?.setActive?.(alignState.leftState)
                    return function () {
                      //
                    }
                  },
                },

                {
                  type: 'togglemenuitem',
                  text: '居中对齐',
                  icon: 'align-center',
                  onAction: function () {
                    alignState = {
                      leftState: false,
                      centerState: !alignState.centerState,
                      rightState: false,
                      justifyState: false,
                    }
                    editor.execCommand('JustifyCenter')
                  },
                  onSetup: function (api: any) {
                    api?.setActive?.(alignState.centerState)
                    return function () {
                      //
                    }
                  },
                },
                {
                  type: 'togglemenuitem',
                  text: '右对齐',
                  icon: 'align-right',
                  onAction: function () {
                    alignState = {
                      leftState: false,
                      centerState: false,
                      rightState: !alignState.rightState,
                      justifyState: false,
                    }
                    editor.execCommand('JustifyRight')
                  },
                  onSetup: function (api: any) {
                    api?.setActive?.(alignState.rightState)
                    return function () {
                      //
                    }
                  },
                },
                {
                  type: 'togglemenuitem',
                  text: '两端对齐',
                  icon: 'align-justify',
                  onAction: function () {
                    alignState = {
                      leftState: false,
                      centerState: false,
                      rightState: false,
                      justifyState: !alignState.justifyState,
                    }
                    editor.execCommand('JustifyFull')
                  },
                  onSetup: function (api: any) {
                    api?.setActive?.(alignState.justifyState)
                    return function () {
                      //
                    }
                  },
                },
              ]

              callback(items)
            },
          })
        },
      }}
    />
  )
}

export default forwardRef(TinyEditor)
