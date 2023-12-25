/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
import { type Editor } from '@tiptap/react'
import { useFullscreen } from 'ahooks'
import { Dropdown, Menu, Popover, Tooltip } from 'antd'
import { size } from 'lodash'
import {
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type RefObject,
} from 'react'
import Icon from '../../../assets/icons'
import getImageSize from '../../../utils/get-image-size'
import getVideoSize from '../../../utils/get-video-size'
import pickFiles from '../../../utils/pick-files'
import SelectColorTool from '../../select-color-tool'
import SelectTableTool from '../../select-table-tool'
import EditLinkDialog from '../components/edit-link-dialog'
import useActions from '../use-actions'
import {
  Action,
  Actions,
  Button,
  Buttons,
  ButtonText,
  DropdownIconButton,
  DropdownOverlay,
  EmojiItem,
  EmojiList,
  MixinButton,
  MoreAction,
  MoreButtons,
  Separator,
  Wrap,
} from './style'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { useEditorStore } from '..'
import { ActionData, mapActionToNode } from './mapActionToNode'

const emojis = [
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '😚',
  '😙',
  '😋',
  '😛',
  '😜',
  '🤪',
  '🥴',
]

const getPopupContainer = (triggerNode: HTMLElement) =>
  (triggerNode.closest('[data-action-bar]') || document.body) as HTMLElement

type Props = {
  editor?: Editor | null
  upload?(file: File): Promise<string> | string | undefined
  editorViewRef: RefObject<HTMLElement>
  // changeFull(isFull: boolean): void
}

const ActionBar = (props: Props) => {
  const [t] = useTranslation()
  const editLinkDialogRef = useRef<any>()
  const { editor } = props
  const actions = useActions(props.editor)
  const [storedTextColor, setStoredTextColor] = useState('#000')
  const [storedTextBackground, setStoredTextBackground] = useState('')
  const onPickImages = async () => {
    const { upload } = props

    const files = await pickFiles({ accept: 'image/*' })

    if (!upload) {
      return
    }
    const [keys, sizes] = await Promise.all([
      Promise.all(files.map(i => upload(i))),
      Promise.all(files.map(i => getImageSize(i))),
    ])

    const tasks = keys.filter(Boolean).map((i, index) => ({
      key: i!,
      ...sizes[index],
    }))

    actions.insertUploadingImages(tasks)
  }
  const onPickVideos = async () => {
    const { upload } = props
    const files = await pickFiles({ accept: 'video/*' })
    if (!upload) {
      return
    }
    const [keys, sizes] = await Promise.all([
      Promise.all(files.map(i => upload(i)).filter(Boolean)),
      Promise.all(files.map(i => getVideoSize(i))),
    ])

    const tasks = keys.filter(Boolean).map((i, index) => ({
      key: i!,
      ...sizes[index],
    }))

    actions.insertUploadingVideos(tasks)
  }
  // const [isFullscreen, { toggleFullscreen }] = useFullscreen(
  //   props.editorViewRef,
  // )
  // const [isFullscreen, setIsFullscreen] = useState(false)
  const { isFullscreen, setIsFullscreen } = useEditorStore()
  const toggleFullscreen = () => {
    const current = !isFullscreen
    setIsFullscreen(current)
  }

  const actionList: ActionData[] = [
    {
      tip: t('title'),

      key: 'content_level',
      icon: '',
      type: 'select',
      value: myEditor => myEditor?.getAttributes('heading').level || '0',
      options: [
        {
          key: '0',
          label: t('text'),
        },
        {
          key: '1',
          label: t('firstLevelTitle'),
        },
        {
          key: '2',
          label: t('secondaryTitle'),
        },
        {
          key: '3',
          label: t('thirdLevelTitle'),
        },
        {
          key: '4',
          label: t('fourthLevelTitle'),
        },
        {
          key: '5',
          label: t('level5Title'),
        },
        {
          key: '6',
          label: t('level6Title'),
        },
      ],
    },
    {
      tip: t('font'),
      key: 'font_size',
      icon: '',
      type: 'select',
      selectWidth: 60,
      value: myEditor => myEditor?.getAttributes('textStyle').fontSize,
      defaultValue: '一',
      options: [
        {
          key: '12px',
          label: '12',
        },
        {
          key: '14px',
          label: '14',
        },
        {
          key: '16px',
          label: '16',
        },
        {
          key: '18px',
          label: '18',
        },
        {
          key: '20px',
          label: '20',
        },
        {
          key: '22px',
          label: '22',
        },
        {
          key: '24px',
          label: '24',
        },
      ],
    },
    // {
    //   key: 'separator-1',
    //   type: 'separator',
    // },
    {
      tip: t('bold'),
      key: 'bold',
      icon: 'bold',
      active: myEditor => myEditor?.isActive('bold'),
    },
    {
      tip: t('underline'),
      key: 'underline',
      icon: 'underline',
      active: myEditor => myEditor?.isActive('underline'),
    },
    {
      tip: t('deleteLine'),
      key: 'strike',
      icon: 'strike',
      active: myEditor => myEditor?.isActive('strike'),
    },
    {
      tip: t('italic'),
      key: 'italic',
      icon: 'italic',
      active: myEditor => myEditor?.isActive('italic'),
    },
    // {
    //   key: 'separator-2',
    //   type: 'separator',
    // },
    {
      tip: t('textColor'),
      key: 'text_color',
      iconNode: <Icon type="font-color" style={{ color: storedTextColor }} />,
      type: 'mixin',
      overlay: (
        <SelectColorTool
          getColor={(value: any) => {
            setStoredTextColor(value)
            actions.setTextColor(value)
          }}
        />
      ),
    },
    {
      tip: t('backgroundColor'),
      key: 'text_background',
      iconNode: <Icon type="fill" style={{ color: storedTextBackground }} />,
      type: 'mixin',
      overlay: (
        <SelectColorTool
          getColor={(value: any) => {
            setStoredTextBackground(value)
            actions.setTextBackground(value)
          }}
        />
      ),
    },
    { tip: t('cleanUp'), key: 'clear', icon: 'clear' },
    // {
    //   key: 'separator-3',
    //   type: 'separator',
    // },
    {
      tip: t('unorderedList'),
      key: 'list',
      icon: 'list',
      active: myEditor => myEditor?.isActive('bulletList'),
    },
    {
      tip: t('orderedList'),
      key: 'ordered_list',
      icon: 'order-list',
      active: myEditor => myEditor?.isActive('orderedList'),
    },
    // {
    //   key: 'separator-4',
    //   type: 'separator',
    // },
    {
      tip: t('alignment'),
      key: 'text_align',
      type: 'select',
      selectWidth: 50,
      value: myEditor =>
        myEditor?.getAttributes('paragraph').textAlign ||
        myEditor?.getAttributes('heading').textAlign,
      options: [
        {
          key: 'left',
          label: <Icon type="align-left" style={{ fontSize: 18 }} />,
        },
        {
          key: 'center',
          label: <Icon type="align-center" style={{ fontSize: 18 }} />,
        },
        {
          key: 'right',
          label: <Icon type="align-right" style={{ fontSize: 18 }} />,
        },
      ],
    },
    {
      tip: t('right'),
      key: 'indent',
      icon: 'indent',
    },
    {
      tip: t('left'),
      key: 'outdent',
      icon: 'outdent',
    },
    {
      tip: t('rowHeight'),
      key: 'line_height',
      type: 'select',
      forceValue: <Icon type="line-height" style={{ fontSize: 20 }} />,
      selectWidth: 40,
      options: [
        {
          key: '1',
          label: '1',
        },
        {
          key: '1.2',
          label: '1.2',
        },
        {
          key: '1.5',
          label: '1.5',
        },
        {
          key: '1.75',
          label: '1.75',
        },
        {
          key: '2',
          label: '2',
        },
        {
          key: '3',
          label: '3',
        },
      ],
    },

    // {
    //   key: 'separator-5',
    //   type: 'separator',
    // },
    {
      tip: t('uploadImages'),
      key: 'image',
      icon: 'image',
    },
    {
      tip: t('uploadVideo'),
      key: 'video',
      icon: 'video',
    },
    {
      tip: t('form'),
      key: 'table',
      icon: 'table',
      type: 'dropdown',
      overlay: (
        <SelectTableTool
          getAxis={(e: any) => {
            actions.insertTable(e.cols, e.rows)
          }}
        />
      ),
    },
    {
      tip: t('icon'),
      key: 'emoji',
      icon: 'emoji',
      type: 'dropdown',
      overlay: (
        <EmojiList>
          {emojis.map(i => (
            <EmojiItem key={i} onClick={event => actions.insertContent(i)}>
              {i}
            </EmojiItem>
          ))}
        </EmojiList>
      ),
    },
    {
      tip: t('link'),
      key: 'link',
      icon: 'link',
      type: 'dropdown',
      overlay: (
        <span onClick={() => editLinkDialogRef.current?.show()}>
          {t('insertLink')}
        </span>
      ),
    },
    {
      tip: t('quote'),
      key: 'quote',
      icon: 'quote',
      active: myEditor => myEditor?.isActive('blockquote'),
    },
    // {
    //   key: 'separator-6',
    //   type: 'separator',
    // },
    {
      tip: isFullscreen ? t('cancelFullScreen') : t('fullScreen'),
      key: 'fullscreen',
      icon: isFullscreen ? 'shrink' : 'grow',
      active: isFullscreen,
    },
  ]
  const actionsRef = useRef<HTMLDivElement>(null)
  const onInsertLink = (formData: Record<string, any>) => {
    // editor
    //   ?.chain()
    //   .focus()
    //   .insertContent({
    //     type: 'text',
    //     text: formData.content || formData.href,
    //     marks: [
    //       {
    //         type: 'link',
    //         attrs: {
    //           href: formData.href,
    //           target: '_blank',
    //         },
    //       },
    //     ],
    //   })
    //   .run()
    editor?.commands.insertContent(
      `<span><a href="${formData.href}">${
        formData.content || formData.href
      }</a> &nbsp;</span>`,
    )
  }
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([])
  const onResize = () => {
    const wrapHeight = actionsRef.current?.clientHeight
    if (!wrapHeight) {
      return
    }

    setHiddenKeys(
      Array.from(
        actionsRef.current.querySelectorAll(
          `${Action.toString()},${Separator.toString()}`,
        ),
      )
        .filter(i => {
          return i && (i as HTMLElement).offsetTop >= wrapHeight
        })
        .map(i => i.getAttribute('data-key')) as string[],
    )
  }

  useLayoutEffect(() => {
    if (!actionsRef.current) {
      return
    }
    const observer = new ResizeObserver(onResize)
    observer.observe(actionsRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const onDoAction = (key: string, data?: unknown) => {
    switch (key) {
      case 'font_size':
        actions.setTextSize(data as string)
        break
      case 'bold':
        actions.toggleBold()
        break
      case 'underline':
        actions.toggleUnderline()
        break
      case 'strike':
        actions.toggleStrike()
        break
      case 'italic':
        actions.toggleItalic()
        break
      case 'clear':
        actions.clear()
        break
      case 'indent':
        actions.indent()
        break
      case 'outdent':
        actions.outdent()
        break
      case 'content_level':
        actions.setBlockLevel(data as number)
        break
      case 'text_color':
        actions.setTextColor(storedTextColor)
        break
      case 'text_background':
        actions.setTextBackground(storedTextBackground)
        break
      case 'list':
        actions.toggleList()
        break
      case 'ordered_list':
        actions.toggleOrderedList()
        break
      case 'text_align':
        actions.setTextAlign(data as string)
        break
      case 'line_height':
        actions.setLineHeight(+(data as string) || 1)
        break
      case 'image':
        onPickImages()
        break
      case 'video':
        onPickVideos()
        break
      case 'table':
      case 'emoji':
      case 'link':
        break
      case 'quote':
        actions.toggleBlockquote()
        break
      case 'fullscreen':
        toggleFullscreen()

        actions.focus()
        break
    }
  }
  // useEffect(() => {
  //   props.changeFull(isFullscreen)
  // }, [isFullscreen])

  return (
    <Wrap data-action-bar>
      <EditLinkDialog
        title={t('insertLink')}
        ref={editLinkDialogRef}
        onSubmit={onInsertLink}
      />
      <Actions ref={actionsRef}>
        {actionList.map(i =>
          mapActionToNode(i, {
            editor,
            dispatch: onDoAction,
            hiddenKeys,
          }),
        )}
        {hiddenKeys.length > 0 && (
          <Dropdown
            overlay={
              <DropdownOverlay
                items={[
                  {
                    key: '',
                    label: (
                      <MoreButtons>
                        {actionList
                          .filter(i => hiddenKeys.includes(i.key))
                          .map(i =>
                            mapActionToNode(i, {
                              editor,
                              dispatch: onDoAction,
                              hiddenKeys,
                            }),
                          )}
                      </MoreButtons>
                    ),
                  },
                ]}
              />
            }
            placement="bottomLeft"
            trigger={['click']}
            getPopupContainer={getPopupContainer}
          >
            <MoreAction>
              <Button>
                <Icon type="more" />
              </Button>
            </MoreAction>
          </Dropdown>
        )}
      </Actions>
    </Wrap>
  )
}

export default ActionBar
