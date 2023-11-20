/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react/no-danger */
/* eslint-disable no-undefined */
import {
  addComment,
  deleteComment,
  getCommentList,
  updateDemandComment,
} from '@/services/demand'
import { delCommonAt } from '@/services/user'
import { bytesToSize, getIdsForAt } from '@/tools'
import { OmitText } from '@star-yun/ui'
import { useSelector } from '@store/index'
import { Editor } from 'ifunuikit'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import CommonUserAvatar from '../CommonUserAvatar'
import DeleteConfirm from '../DeleteConfirm'
import EditComment from '../EditComment'
import IconFont from '../IconFont'
import { getMessage } from '../Message'
import NoData from '../NoData'
import { CloseWrap, HiddenText } from '../StyleCommon'
import UploadAttach, { fileIconMap } from '../UploadAttach'
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
} from './style'
import useMkeyDown from '@/hooks/useMkeyDown'
import CommentEditor from '../CommentEditor'

interface Props {
  detail?: any
  isOpen?: boolean
  onRef?: any
  // 是否是新开需求详情
  isOpenInfo?: boolean
}
const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const DemandComment = (props: Props) => {
  const attachRef = useRef<any>(null)
  const [t]: any = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleComment, setIsVisibleComment] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)

  const handleShortcutEvent = () => {
    setIsVisibleComment(true)
  }

  useMkeyDown(handleShortcutEvent)
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

  // 获取评论列表
  const getList = async () => {
    const result = await getCommentList({
      projectId: props.detail.projectId,
      demandId: props.detail.id,
      page: 1,
      pageSize: 999,
    })
    setDataList(result)
  }

  // 删除评论
  const onDeleteComment = (item: any) => {
    setIsVisible(true)
    setIsDeleteId(item.id)
  }

  const onReview = (item: any, attachList: any) => {
    setPictureList({
      imageArray: attachList
        ?.filter((j: any) => imgs.includes(j.attachment.ext))
        ?.map((k: any, index: any) => ({
          src: k.attachment.path,
          index,
        })),
      index: attachList
        ?.filter((j: any) => imgs.includes(j.attachment.ext))
        ?.findIndex((i: any) => i.attachment.path === item.path),
    })
    setPreviewOpen(true)
  }

  const downloadIamge = (src: string, name1: string) => {
    let urls = ''
    urls = `${src}?t=${new Date().getTime()}`
    fetch(urls).then(response => {
      response.blob().then(myBlob => {
        const href = URL.createObjectURL(myBlob)
        const a = document.createElement('a')
        a.href = href
        a.download = name1
        a.click()
      })
    })
  }

  // 下载图片
  const onDownload = (url: string, name1: string) => {
    downloadIamge(url, name1)
  }

  // 删除附件
  const onTapRemove = async (attid: any, id: any) => {
    await delCommonAt({
      project_id: props.detail.projectId,
      comment_id: attid,
      att_id: id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    getList()
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteComment({ projectId: props.detail.projectId, id: isDeleteId })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDeleteId(0)
      setIsVisible(false)
      getList()
    } catch (error) {
      //
    }
  }

  const onAddConfirm = async (params: any) => {
    if (attachRef.current?.getAttachState() > 0) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
      })
      return
    }
    try {
      await addComment({
        projectId: props.detail.projectId,
        demandId: props.detail.id,
        content: params.content,
        attachment: params.attachment,
        a_user_ids: params.a_user_ids,
      })
      getMessage({ msg: t('project.replaySuccess'), type: 'success' })
      getList()
      setIsVisibleComment(false)
    } catch (error) {
      //
    }
  }

  // 点击编辑评论按钮
  const onEdit = (item: any) => {
    const result =
      dataList?.list.map((i: any) => ({
        ...i,
        isEdit: i.id === item.id ? true : false,
      })) || []
    setDataList({ list: result })
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (props.detail?.info === value || !value) {
      return
    }
    await updateDemandComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: props.detail.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    getList()
  }

  useEffect(() => {
    if (props.isOpen) {
      getList()
    }
  }, [props.isOpen])

  return (
    <div className={props.isOpenInfo ? haveAuto : ''}>
      <EditComment
        projectId={props.detail.projectId}
        visibleEdit={isVisibleComment}
        editClose={() => setIsVisibleComment(false)}
        editConfirm={onAddConfirm}
      />
      <div>
        <DeleteConfirm
          text={t('mark.cd')}
          isVisible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          onConfirm={onDeleteConfirm}
        />
        {props.isOpenInfo && (
          <CommentTitle>
            <Label>{t('requirements_review')}</Label>
            {isComment && (
              <CommonButton
                onClick={() => setIsVisibleComment(true)}
                type="primaryText"
                iconPlacement="left"
                icon="plus"
              >
                {t('add_a_comment')}
              </CommonButton>
            )}
          </CommentTitle>
        )}

        {!props.isOpenInfo && (
          <>
            <Label>{t('requirements_review')}</Label>
            {isComment && (
              <CommonButton
                onClick={() => setIsVisibleComment(true)}
                type="primaryText"
                iconPlacement="left"
                icon="plus"
              >
                {t('add_a_comment')}
              </CommonButton>
            )}
          </>
        )}

        {!!dataList?.list &&
          (dataList?.list?.length > 0 ? (
            <div>
              {dataList?.list?.map((item: any) => (
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
                      item={item}
                      onEditComment={value => onEditComment(value, item.id)}
                    />
                    {item.attachment?.length > 0 && (
                      <div
                        style={{
                          minWidth: '300px',
                          marginTop: '8px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        <UploadAttach
                          ref={attachRef}
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
                      </div>
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

export default DemandComment
