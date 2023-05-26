import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import { createRef, useEffect, useRef, useState } from 'react'
import { DetailInfoWrap, InfoItem, InfoWrap, Label, TextWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { Editor, EditorRef } from '@xyfe/uikit'
import { AddWrap, DragLine, MouseDom } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CommonButton from '@/components/CommonButton'
import ChildSprint from './ChildSprint'
import LinkSprint from './LinkSprint'
import ActivitySprint from './ActivitySprint'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { useDispatch, useSelector } from '@store/index'
import {
  addInfoSprint,
  addSprintComment,
  deleteInfoSprint,
} from '@/services/sprint'
import { useSearchParams } from 'react-router-dom'
import { getIdsForAt, getParamsData, removeNull } from '@/tools'
import { getMessage } from '@/components/Message'
import { getSprintCommentList, getSprintInfo } from '@store/sprint/sprint.thunk'
import SprintTag from '@/components/TagComponent/SprintTag'
import { Anchor, Tabs, TabsProps } from 'antd'

const SprintDetailInfo = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const LeftDom = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
  const commentDom: any = createRef()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { sprintInfo } = useSelector(store => store.sprint)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  //   当前删除的附件数据
  const [tagList, setTagList] = useState<any>([])
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [focus, setFocus] = useState(false)
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(200)
  const [endWidth, setEndWidth] = useState(200)
  const [tabActive, setTabActive] = useState('sprint-info')

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  //   添加附件
  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }
    await addInfoSprint({
      projectId: id,
      sprintId,
      type: 'attachment',
      targetId: [obj],
    })
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    onBottom()
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoSprint({
      projectId: id,
      sprintId,
      type: 'attachment',
      targetId,
    })
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    // onBottom()
  }

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    open({
      title: '删除确认',
      text: t('p2.del'),
      onConfirm: () => {
        onDeleteConfirm(file)
        return Promise.resolve()
      },
    })
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addSprintComment({
      projectId: id,
      sprintId,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: '评论成功' })
    dispatch(
      getSprintCommentList({
        projectId: id,
        sprintId,
        page: 1,
        pageSize: 9999,
      }),
    )
    commentDom.current.cancel()
  }

  const items: TabsProps['items'] = [
    {
      key: 'sprint-info',
      label: `Tab 1`,
    },
    {
      key: 'sprint-attachment',
      label: `Tab 2`,
    },
    {
      key: 'sprint-tag',
      label: `Tab 3`,
    },
    {
      key: 'sprint-childSprint',
      label: `Tab 1`,
    },
    {
      key: 'sprint-linkSprint',
      label: `Tab 2`,
    },
    {
      key: 'sprint-activity',
      label: `Tab 3`,
    },
  ]

  // 拖动线条
  const onDragLine = () => {
    // let width = LeftDom.current?.clientWidth || 0
    // document.onmousemove = e => {
    //   setEndWidth(200)
    //   setFocus(true)
    //   if (!LeftDom.current) return
    //   LeftDom.current.style.transition = '0s'
    //   width = e.clientX
    //   if (width > maxWidth) {
    //     setLeftWidth(maxWidth)
    //   } else {
    //     setLeftWidth(width < 26 ? 26 : width)
    //   }
    // }
    // document.onmouseup = () => {
    //   if (width < 200) {
    //     setEndWidth(width)
    //     setLeftWidth(26)
    //   } else if (width > maxWidth) {
    //     setLeftWidth(maxWidth)
    //   } else {
    //     setLeftWidth(width)
    //   }
    //   if (!LeftDom.current) return
    //   LeftDom.current.style.transition = '0.3s'
    //   document.onmousemove = null
    //   document.onmouseup = null
    //   setFocus(false)
    // }
  }

  useEffect(() => {
    if (tabActive) {
      const dom = document.getElementById(tabActive)
      dom?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [tabActive])

  useEffect(() => {
    setTagList(
      sprintInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [sprintInfo])

  return (
    <>
      <DeleteConfirmModal />
      <InfoWrap>
        <div style={{ display: 'flex' }}>
          {items.map((i: any) => (
            <div key={i.key} onClick={() => setTabActive(i.key)}>
              {i.label}
            </div>
          ))}
        </div>
        <DetailInfoWrap ref={LeftDom}>
          <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
            <DragLine
              active={focus}
              className="line"
              style={{ marginLeft: 0 }}
            />
          </MouseDom>
          <InfoItem
            id="sprint-info"
            style={{
              marginTop: '0px',
            }}
          >
            <Label>描述</Label>
            {sprintInfo?.info ? (
              <Editor
                value={sprintInfo?.info}
                getSuggestions={() => []}
                readonly={!isEditInfo}
                ref={editorRef}
                // onReadonlyClick={() => {
                //   setIsEditInfo(true)
                //   setTimeout(() => {
                //     editorRef.current?.focus()
                //   }, 0)
                // }}
              />
            ) : (
              <TextWrap>--</TextWrap>
            )}
          </InfoItem>
          <InfoItem id="sprint-attachment">
            <Label>{t('common.attachment')}</Label>
            <div>
              {projectInfo?.projectPermissions?.filter(
                (i: any) => i.name === '附件上传',
              ).length > 0 && (
                <UploadAttach
                  onBottom={onBottom}
                  defaultList={sprintInfo?.attachment?.map((i: any) => ({
                    url: i.attachment.path,
                    id: i.id,
                    size: i.attachment.size,
                    time: i.created_at,
                    name: i.attachment.name,
                    suffix: i.attachment.ext,
                    username: i.user_name ?? '--',
                  }))}
                  canUpdate
                  onC
                  del={onDeleteInfoAttach}
                  add={onAddInfoAttach}
                  addWrap={
                    <CommonButton type="primaryText" icon="plus">
                      添加附件
                    </CommonButton>
                  }
                />
              )}
              {projectInfo?.projectPermissions?.filter(
                (i: any) => i.name === '附件上传',
              ).length <= 0 && <span>--</span>}
            </div>
          </InfoItem>
          <InfoItem id="sprint-tag">
            <Label>{t('common.tag')}</Label>
            <SprintTag
              defaultList={tagList}
              canAdd
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </InfoItem>
          <ChildSprint />
          <LinkSprint />
          <ActivitySprint />
        </DetailInfoWrap>
        <CommentFooter
          onRef={commentDom}
          placeholder="发表评论（按M快捷键发表评论）"
          personList={removeNull(projectInfoValues, 'user_name')?.map(
            (k: any) => ({
              label: k.content,
              id: k.id,
            }),
          )}
          onConfirm={onConfirmComment}
          style={{ padding: '0 24px', width: 'calc(100% - 24px)' }}
          maxHeight="60vh"
          hasAvatar
        />
      </InfoWrap>
    </>
  )
}

export default SprintDetailInfo
