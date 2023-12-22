/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */
import { bytesToSize, getIdsForAt } from '@/tools'
import { OmitText } from '@star-yun/ui'
import { useDispatch, useSelector } from '@store/index'
import { Editor } from 'ifunuikit'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BlueCss,
  Card,
  CommentItem,
  CommentTitle,
  Gred,
  GredParent,
  HovDiv,
  Label,
  MyDiv,
  RedCss,
  Second,
  TextWrap,
  haveAuto,
} from '../style'
import { getMessage } from '@/components/Message'
import EditComment from '@/components/EditComment'
import CommonButton from '@/components/CommonButton'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { CloseWrap, HiddenText } from '@/components/StyleCommon'
import UploadAttach, { fileIconMap } from '@/components/UploadAttach'
import NoData from '@/components/NoData'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { getFlawCommentList } from '@store/flaw/flaw.thunk'
import {
  addFlawComment,
  deleteFlawComment,
  deleteFlawCommentAttach,
  updateFlawComment,
} from '@/services/flaw'
import CommentEditor from '@/components/CommentEditor'
import { setFlawCommentList } from '@store/flaw'

interface Props {
  detail?: any
  onRef?: any
  // 是否是缺陷详情
  isOpenInfo?: boolean
}
const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const FlawComment = (props: Props) => {
  const attachRef = useRef<any>(null)
  const dispatch = useDispatch()
  const [t]: any = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const { flawCommentList } = useSelector(store => store.flaw)

  const [isVisibleComment, setIsVisibleComment] = useState(false)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()

  useImperativeHandle(props.onRef, () => {
    return {
      addComment: () => setIsVisibleComment(true),
    }
  })

  // 判断当前登录的人是否有编辑评论的权限
  const isComment =
    projectInfo?.projectPermissions?.filter(
      (i: any) =>
        i.identity ===
        (projectInfo.projectType === 1
          ? 'b/story/comment'
          : 'b/transaction/comment'),
    ).length > 0

  // 更新评论
  const onUpdateComment = () => {
    dispatch(
      getFlawCommentList({
        projectId: props.detail.projectId,
        id: props.detail.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 删除附件
  const onTapRemove = async (attid: any, id: any) => {
    await deleteFlawCommentAttach({
      project_id: props.detail.projectId,
      comment_id: attid,
      att_id: id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onUpdateComment()
  }

  // 删除确认
  const onDeleteConfirm = async (item: any) => {
    await deleteFlawComment({ projectId: props.detail.projectId, id: item.id })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onUpdateComment()
  }

  // 点击编辑评论按钮
  const onEdit = (item: any) => {
    const result =
      flawCommentList?.list.map((i: any) => ({
        ...i,
        isEdit: i.id === item.id ? true : false,
      })) || []
    dispatch(setFlawCommentList({ list: result }))
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (props.detail?.info === value || !value) {
      return
    }
    await updateFlawComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: props.detail.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    onUpdateComment()
  }

  // 删除评论
  const onDeleteComment = (item: any) => {
    open({
      title: t('deleteConfirmation'),
      text: t('areYouSureToDeleteThisComment'),
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  // 添加评论
  const onAddConfirm = async (params: any) => {
    if (attachRef.current?.getAttachState() > 0) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
      })
      return
    }
    try {
      await addFlawComment({
        projectId: props.detail.projectId,
        id: props.detail.id,
        content: params.content,
        attachment: params.attachment,
        a_user_ids: params.a_user_ids,
      })
      getMessage({ msg: t('project.replaySuccess'), type: 'success' })
      onUpdateComment()
      setIsVisibleComment(false)
    } catch (error) {
      //
    }
  }

  return (
    <div>
      <DeleteConfirmModal />
      <div>
        <CommentTitle>
          <Label style={{ marginBottom: 0 }}>{t('requirements_review')}</Label>
        </CommentTitle>
        {!!flawCommentList?.list &&
          (flawCommentList?.list?.length > 0 ? (
            <div>
              {flawCommentList?.list?.map((item: any) => (
                <CommentItem key={item.id}>
                  <CommonUserAvatar avatar={item.avatar} />
                  <TextWrap>
                    <MyDiv>
                      <HovDiv>
                        {isComment &&
                        userInfo?.id === item.userId &&
                        !item.isEdit ? (
                          <CloseWrap
                            width={24}
                            height={24}
                            onClick={() => onEdit(item)}
                          >
                            <IconFont type="edit" style={{ fontSize: 16 }} />
                          </CloseWrap>
                        ) : null}
                        {isComment && userInfo?.id === item.userId ? (
                          <CloseWrap
                            width={24}
                            height={24}
                            onClick={() => onDeleteComment(item)}
                          >
                            <IconFont type="delete" style={{ fontSize: 16 }} />
                          </CloseWrap>
                        ) : null}
                      </HovDiv>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          style={{
                            marginRight: '12px',
                          }}
                          className="name"
                        >
                          <HiddenText>
                            <OmitText
                              width={100}
                              tipProps={{
                                getPopupContainer: node => node,
                              }}
                            >
                              {item.name}
                            </OmitText>
                          </HiddenText>
                        </span>
                        <span className="common">
                          <HiddenText>
                            <OmitText
                              width={240}
                              tipProps={{
                                getPopupContainer: node => node,
                              }}
                            >
                              {item.statusContent}
                            </OmitText>
                          </HiddenText>
                        </span>
                      </div>
                    </MyDiv>
                    <div className="common" style={{ paddingRight: 30 }}>
                      {item.createdTime}
                    </div>
                    <CommentEditor
                      item={{
                        ...item,
                        canComment: isComment && userInfo?.id === item.userId,
                      }}
                      onEditComment={value => onEditComment(value, item.id)}
                    />
                    {item.attachment?.length > 0 && (
                      <UploadAttach
                        canUpdate
                        defaultList={item.attachment.map((i: any) => ({
                          url: i.attachment.path,
                          id: i.id,
                          size: i.attachment.size,
                          time: i.created_at,
                          name: i.attachment.name,
                          suffix: i.attachment.ext,
                          username: i.user_name ?? '--',
                        }))}
                        del={(id: any) => onTapRemove(item.id, id)}
                        onChangeAttachment={() => {}}
                      />
                    )}
                  </TextWrap>
                </CommentItem>
              ))}
            </div>
          ) : (
            <NoData />
          ))}
      </div>
    </div>
  )
}

export default FlawComment
