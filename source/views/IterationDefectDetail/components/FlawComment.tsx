/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */
import { bytesToSize } from '@/tools'
import { OmitText } from '@star-yun/ui'
import { useSelector } from '@store/index'
import { Editor } from '@xyfe/uikit'
import { useEffect, useImperativeHandle, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Viewer from 'react-viewer'
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
} from '../style'
import { getMessage } from '@/components/Message'
import EditComment from '@/components/EditComment'
import CommonButton from '@/components/CommonButton'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { HiddenText } from '@/components/StyleCommon'
import { fileIconMap } from '@/components/UploadAttach'
import NoData from '@/components/NoData'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import {
  addFlawComment,
  deleteFlawComment,
  deleteFlawCommentAttach,
  getFlawCommentList,
} from '@/services/flaw'

interface Props {
  detail?: any
  isOpen?: boolean
  onRef?: any
  // 是否是新开需求详情
  isOpenInfo?: boolean
}
const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const FlawComment = (props: Props) => {
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

  // 获取评论列表
  const getList = async () => {
    const result = await getFlawCommentList({
      projectId: props.detail.projectId,
      id: props.detail.id,
      page: 1,
      pageSize: 999,
    })
    setDataList(result)
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
    await deleteFlawCommentAttach({
      project_id: props.detail.projectId,
      comment_id: attid,
      att_id: id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    getList()
  }

  // 删除确认
  const onDeleteConfirm = async (item: any) => {
    await deleteFlawComment({ projectId: props.detail.projectId, id: item.id })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    getList()
  }

  // 删除评论
  const onDeleteComment = (item: any) => {
    open({
      title: '删除确认',
      text: '确认删除该评论？',
      onConfirm() {
        onDeleteConfirm(item)
        return Promise.resolve()
      },
    })
  }

  // 添加评论
  const onAddConfirm = async (params: any) => {
    try {
      await addFlawComment({
        projectId: props.detail.projectId,
        id: props.detail.id,
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

  useEffect(() => {
    if (props.isOpen && props.detail.id) {
      getList()
    }
  }, [props.isOpen || props.detail.id])

  return (
    <>
      <EditComment
        projectId={props.detail.projectId}
        visibleEdit={isVisibleComment}
        editClose={() => setIsVisibleComment(false)}
        editConfirm={onAddConfirm}
      />
      <DeleteConfirmModal />
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 112px)',
        }}
      >
        <CommentTitle>
          <Label style={{ marginBottom: 0 }}>{t('requirements_review')}</Label>
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
        <div
          style={{
            width: '100%',
            height: 'calc(100% - 40px)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <>
                {dataList?.list?.map((item: any) => (
                  <CommentItem key={item.id}>
                    <CommonUserAvatar avatar={item.avatar} />
                    <TextWrap>
                      <MyDiv>
                        <HovDiv>
                          {isComment && userInfo?.id === item.userId ? (
                            <IconFont
                              type="close"
                              onClick={() => onDeleteComment(item)}
                            />
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
                      <Editor
                        value={
                          /(?<start>^<p>*)|(?<end><\p>*$)/g.test(item.content)
                            ? item.content
                            : `<p>${item.content}</p>`
                        }
                        getSuggestions={() => []}
                        readonly
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
                          {item.attachment.map((i: any) => {
                            return (
                              <Card
                                style={{
                                  margin: 0,
                                }}
                                key={i.id}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                  }}
                                >
                                  <GredParent
                                    style={{
                                      marginRight: '8px',
                                      position: 'relative',
                                    }}
                                  >
                                    {imgs.includes(i.attachment.ext) && (
                                      <img
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '4px',
                                        }}
                                        src={i.attachment.path}
                                        alt=""
                                      />
                                    )}
                                    {!imgs.includes(i.attachment.ext) && (
                                      <IconFont
                                        style={{
                                          fontSize: 40,
                                          color: 'white',
                                          borderRadius: '8px',
                                        }}
                                        type={
                                          fileIconMap[i.attachment.ext] ||
                                          'colorunknown'
                                        }
                                      />
                                    )}
                                    {imgs.includes(i.attachment.ext) && (
                                      <Gred
                                        onClick={() => {
                                          onReview(
                                            i.attachment,
                                            item.attachment,
                                          )
                                        }}
                                      >
                                        <IconFont
                                          style={{
                                            fontSize: 18,
                                            color: 'white',
                                          }}
                                          type="zoomin"
                                        />
                                      </Gred>
                                    )}
                                    {previewOpen ? (
                                      <Viewer
                                        zIndex={99999}
                                        visible={previewOpen}
                                        images={pictureList?.imageArray}
                                        activeIndex={pictureList?.index}
                                        onClose={() => setPreviewOpen(false)}
                                      />
                                    ) : null}
                                  </GredParent>
                                  <div>
                                    <div
                                      style={{
                                        width: '100%',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                        color: 'var(--neutral-n2)',
                                        lineHeight: '22px',
                                        wordBreak: 'break-all',
                                      }}
                                    >
                                      {i.attachment.name}
                                    </div>
                                    <div
                                      style={{
                                        height: '20px',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        color: 'var(--neutral-n3)',
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <span>
                                        {bytesToSize(i?.attachment.size) ?? ''}
                                      </span>
                                      <span
                                        style={{
                                          margin: '0 6px 0 6px',
                                        }}
                                      >
                                        ·
                                      </span>
                                      <span
                                        style={{
                                          marginRight: '12px',
                                        }}
                                      >
                                        {i.user_name}
                                      </span>
                                      <span>{i.created_at}</span>
                                    </div>
                                    <Second
                                      style={{
                                        height: '20px',
                                      }}
                                    >
                                      <BlueCss
                                        onClick={() =>
                                          onDownload(
                                            i.attachment.path,
                                            i.attachment.name,
                                          )
                                        }
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          color: 'var(--primary-d1)',
                                        }}
                                      >
                                        {t('p2.download') as unknown as string}
                                      </BlueCss>
                                      {isComment &&
                                      userInfo?.id === item.userId ? (
                                        <RedCss
                                          onClick={() =>
                                            onTapRemove(item.id, i.id)
                                          }
                                        >
                                          {t('p2.delete')}
                                        </RedCss>
                                      ) : null}
                                    </Second>
                                  </div>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      )}
                    </TextWrap>
                  </CommentItem>
                ))}
              </>
            ) : (
              <NoData />
            ))}
        </div>
      </div>
    </>
  )
}

export default FlawComment
