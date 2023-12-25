/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
import { type Editor } from '@tiptap/react'
import { Dropdown } from 'antd'
import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import Icon from '../../../assets/icons'
import EditLinkDialog from '../components/edit-link-dialog'
import {
  Action,
  Actions,
  Button,
  DropdownOverlay,
  MoreAction,
  MoreButtons,
  Separator,
  Wrap,
} from './style'
import { useTranslation } from 'react-i18next'
import { ActionKeys, mapActionToNode } from './mapActionToNode'
import { useActionList } from './useActionList'

const getPopupContainer = (triggerNode: HTMLElement) =>
  (triggerNode.closest('[data-action-bar]') || document.body) as HTMLElement

type Props = {
  editor?: Editor | null
  upload?(file: File): Promise<string> | string | undefined
  editorViewRef: RefObject<HTMLElement>
  include?: ActionKeys[]
  isHiddenMoreBtn?: boolean
}

const ActionBar = (props: Props) => {
  const [t] = useTranslation()
  const editLinkDialogRef = useRef<any>()
  const { editor } = props

  const { actionList, onDoAction } = useActionList({
    include: props.include,
    editor: props.editor,
    insertLink: () => {
      editLinkDialogRef.current?.show()
    },
    upload: props.upload,
  })

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

  const moreBtn = !props.isHiddenMoreBtn && hiddenKeys.length > 0 && (
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
  )

  return (
    <Wrap data-action-bar>
      <EditLinkDialog
        title={t('insertLink')}
        ref={editLinkDialogRef}
        onSubmit={onInsertLink}
      />
      <Actions isHiddenMoreBtn={props.isHiddenMoreBtn} ref={actionsRef}>
        {actionList.map(i =>
          mapActionToNode(i, {
            editor,
            dispatch: onDoAction,
            hiddenKeys,
          }),
        )}
        {moreBtn}
      </Actions>
    </Wrap>
  )
}

export default ActionBar
