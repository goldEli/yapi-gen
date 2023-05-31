/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import {
  BlueCss,
  Card,
  CommentItem,
  Gred,
  GredParent,
  HovDiv,
  Label,
  MyDiv,
  RedCss,
  Second,
  TextWrap,
} from './style'
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import CommonUserAvatar from '../CommonUserAvatar'
import { useSelector } from '@store/index'
import IconFont from '../IconFont'
import { CloseWrap, HiddenText } from '../StyleCommon'
import { OmitText } from '@star-yun/ui'
import { Editor, EditorRef } from '@xyfe/uikit'
import { fileIconMap } from '../UploadAttach'
import Viewer from 'react-viewer'
import { bytesToSize, removeNull } from '@/tools'
import NoData from '../NoData'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { Space } from 'antd'

const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']

interface CommentEditorProps {
  item: any
  onEditComment(value: string): void
}
const CommentEditor = (props: CommentEditorProps) => {
  const editorRef = useRef<EditorRef>(null)
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const { projectInfoValues } = useSelector(store => store.project)

  // 富文本失焦
  const onBlurEditor = async () => {
    setIsEditInfo(false)
    props.onEditComment(editInfo)
  }

  // 只读编辑
  const onReadonlyClick = () => {
    setIsEditInfo(true)
    setTimeout(() => {
      editorRef.current?.focus()
    }, 10)
  }

  useEffect(() => {
    if (props.item.id) {
      setEditInfo(
        /(?<start>^<p>*)|(?<end><\p>*$)/g.test(props.item.content)
          ? props.item.content
          : `<p>${props.item.content}</p>`,
      )
      if (props.item.isEdit) {
        onReadonlyClick()
      }
    }
  }, [props.item])

  return (
    <Editor
      at
      ref={editorRef}
      value={editInfo}
      getSuggestions={removeNull(projectInfoValues, 'user_name')?.map(
        (k: any) => ({
          label: k.content,
          id: k.id,
        }),
      )}
      readonly={!isEditInfo}
      onReadonlyClick={onReadonlyClick}
      onChange={(value: string) => setEditInfo(value)}
      onBlur={onBlurEditor}
    />
  )
}

interface CommonCommentProps {
  data: {
    list: Model.Affairs.CommentListInfo[]
  }
  onDeleteConfirm(id: number): void
  onEditComment?(value: string, id: number): void
}
const CommonComment = (props: CommonCommentProps) => {
  const [t]: any = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [dataSource, setDataSource] = useState<{
    list: Model.Affairs.CommentListInfo[]
  }>()

  // 判断当前登录的人是否有编辑评论的权限
  const isComment =
    projectInfo?.projectPermissions?.filter(
      (i: any) =>
        i.identity ===
        (projectInfo.projectType === 1
          ? 'b/story/comment'
          : 'b/transaction/comment'),
    ).length > 0

  // 删除评论
  const onDeleteComment = (item: any) => {
    open({
      title: '删除确认',
      text: '确认删除该评论？',
      onConfirm: () => {
        props.onDeleteConfirm(item.id)
        return Promise.resolve()
      },
    })
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

  // 删除附件 -- 需求
  const onTapRemove = async (attid: any, id: any) => {
    // await delCommonAt({
    //   project_id: props.detail.projectId,
    //   comment_id: attid,
    //   att_id: id,
    // })
    // getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    // getList()
  }

  // 点击编辑评论按钮
  const onEdit = (item: Model.Affairs.CommentListInfo) => {
    const result =
      dataSource?.list.map((i: Model.Affairs.CommentListInfo) => ({
        ...i,
        isEdit: i.id === item.id ? true : false,
      })) || []
    setDataSource({ list: result })
  }

  useEffect(() => {
    setDataSource({
      list: props.data.list || [],
    })
  }, [props.data])

  return (
    <div>
      <DeleteConfirmModal />
      {!!dataSource?.list &&
        (dataSource?.list?.length > 0 ? (
          <div>
            {dataSource?.list?.map((item: any) => (
              <CommentItem key={item.id}>
                <CommonUserAvatar avatar={item.avatar} />
                <TextWrap>
                  <MyDiv>
                    <HovDiv>
                      {isComment && userInfo?.id === item.userId ? (
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
                    onEditComment={value =>
                      props.onEditComment?.(value, item.id)
                    }
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
                                      onReview(i.attachment, item.attachment)
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
                                  {isComment && userInfo?.id === item.userId ? (
                                    <RedCss
                                      onClick={() => onTapRemove(item.id, i.id)}
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
          </div>
        ) : (
          <NoData />
        ))}
    </div>
  )
}

export default CommonComment
