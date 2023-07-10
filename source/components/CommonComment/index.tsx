/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */
import { useTranslation } from 'react-i18next'
import { CommentItem, HovDiv, MyDiv, TextWrap } from './style'
import { useEffect, useRef, useState } from 'react'
import CommonUserAvatar from '../CommonUserAvatar'
import { useSelector } from '@store/index'
import IconFont from '../IconFont'
import { CloseWrap, HiddenText } from '../StyleCommon'
import { OmitText } from '@star-yun/ui'
import { Editor, EditorRef } from '@xyfe/uikit'
import { removeNull } from '@/tools'
import NoData from '../NoData'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { uploadFile } from '../AddWorkItem/CreateWorkItemLeft'

interface CommentEditorProps {
  item: any
  onEditComment(value: string): void
}
const CommentEditor = (props: CommentEditorProps) => {
  const editorRef = useRef<EditorRef>(null)
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [editInfo, setEditInfo] = useState('')
  const { projectInfoValues } = useSelector(store => store.project)
  const editorRef2 = useRef<any>()
  // 富文本失焦
  const onBlurEditor = async () => {
    props.onEditComment(editorRef2.current)
    setIsEditInfo(false)
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
      upload={uploadFile}
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
      onReadonlyClick={() => onReadonlyClick()}
      onChange={(value: string) => (editorRef2.current = value)}
      onBlur={() => onBlurEditor()}
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
    if (!item.isEdit) {
      open({
        title: '删除确认',
        text: '确认删除该评论？',
        onConfirm: () => {
          props.onDeleteConfirm(item.id)
          return Promise.resolve()
        },
      })
    }
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
                    onEditComment={value =>
                      props.onEditComment?.(value, item.id)
                    }
                  />
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
