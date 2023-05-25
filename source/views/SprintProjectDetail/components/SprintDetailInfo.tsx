import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import { createRef, useEffect, useRef, useState } from 'react'
import { DetailInfoWrap, InfoItem, Label, TextWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { Editor } from '@xyfe/uikit'
import { AddWrap } from '@/components/StyleCommon'
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

const SprintDetailInfo = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const LeftDom = useRef<HTMLDivElement>(null)
  const commentDom: any = createRef()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { sprintInfo } = useSelector(store => store.sprint)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  //   当前删除的附件数据
  const [files, setFiles] = useState<Model.Sprint.AttachTarget[]>([])
  const [tagList, setTagList] = useState<any>([])

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
  const onDeleteConfirm = async () => {
    await deleteInfoSprint({
      projectId: id,
      sprintId,
      type: 'attachment',
      targetId: files,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    onBottom()
  }

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    setFiles(file)
    open({
      title: '删除确认',
      text: t('p2.del'),
      onConfirm: () => {
        onDeleteConfirm()
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
      <DragMoveContainer
        max="65vw"
        min="30vw"
        width="65vw"
        height="calc(100vh - 212px)"
      >
        <DetailInfoWrap ref={LeftDom}>
          <InfoItem
            style={{
              marginTop: '0px',
            }}
          >
            <Label>描述</Label>
            {sprintInfo?.info ? (
              <Editor
                value={sprintInfo?.info}
                getSuggestions={() => []}
                readonly
              />
            ) : (
              <TextWrap>--</TextWrap>
            )}
          </InfoItem>
          <InfoItem>
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
          <InfoItem>
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
      </DragMoveContainer>
    </>
  )
}

export default SprintDetailInfo
