/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, message, Form, Skeleton, Space, Input } from 'antd'
import { Editor, EditorRef } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import { DragLine } from '@/components/StyleCommon'
import DetailsSkeleton from '@/components/DemandDetailDrawer/DetailsSkeleton'
import { throttle } from 'lodash'
import { uploadFileToKey } from '@/services/cos'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  Header,
  BackIcon,
  ChangeIconGroup,
  Content,
  SkeletonStatus,
  UpWrap,
  DownWrap,
  ContentHeadWrap,
  CommentFooter,
  DetailItem,
  TargetUserItem,
  TargetUserContent,
  ContactDemandBox,
  ContactDemandItem,
  CommentBox,
} from './style'
import { setViewReportModal } from '@store/workReport'
import {
  addReportComment,
  getReportComment,
  getReportInfo,
} from '@/services/report'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'

interface TargetTabsProps {
  list: any
}

const TargetTabs = (props: TargetTabsProps) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <TargetUserItem>
      <div className="tabs">
        <span
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => setActiveTab(0)}
        >
          已读 ({props.list?.filter((k: any) => k.type !== 1)?.length})
        </span>
        <span
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => setActiveTab(1)}
        >
          未读 ({props.list?.filter((k: any) => k.type === 1)?.length})
        </span>
      </div>
      <TargetUserContent size={24}>
        {props.list
          ?.filter((k: any) =>
            (activeTab === 1 ? [1] : [2, 3]).includes(k.type),
          )
          ?.map((i: any) => (
            <div key={i.user_id}>
              <CommonUserAvatar avatar={i.user.avatar} name={i.user.name} />
            </div>
          ))}
      </TargetUserContent>
    </TargetUserItem>
  )
}

const ContactDemand = (props: { list: any }) => {
  const list = props.list?.length ? props.list : []
  return (
    <ContactDemandBox>
      {list?.map((i: any) => (
        <ContactDemandItem key={i.id}>
          【{i.id}】<span className="name">{i.name}</span>
        </ContactDemandItem>
      ))}
    </ContactDemandBox>
  )
}

const AttachmentBox = (props: { list: any }) => {
  const list = props.list?.length ? props.list : []
  const resultList = list?.map((item: any) => {
    return {
      url: item.url,
      id: new Date().getTime() + Math.random(),
      size: item.size,
      time: item.ctime,
      name: item.name || '--',
      suffix: item.ext,
      username: item.username,
    }
  })
  return <UploadAttach isReport canUpdate power defaultList={resultList} />
}

const ReportDetailDrawer = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { viewReportModal } = useSelector(store => store.workReport)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reportIds, setReportIds] = useState<any>([])
  const [isReview, setIsReview] = useState(false)
  const [commentList, setCommentList] = useState([])
  const [form] = Form.useForm()
  const reviewRef = useRef<any>()
  const leftWidth = 640
  const editorRef = useRef<EditorRef>(null)

  // 拖动线条
  const onDragLine = (e: React.MouseEvent) => {
    const moveHandler = (ev: React.MouseEvent) => {
      setFocus(true)
      const drawer: HTMLElement = document.querySelector(
        '.drawerRoot .ant-drawer-content-wrapper',
      )!
      const drawerBody: HTMLElement = document.querySelector(
        '.drawerRoot .ant-drawer-body',
      )!
      drawerBody.style.minWidth = '100%'
      drawerBody.style.right = '0px'
      const nextWidth = innerWidth - ev.clientX
      if (nextWidth <= leftWidth) return
      drawer!.style.width = innerWidth - ev.clientX + 'px'
    }
    const debounceWrap: any = throttle(moveHandler, 60, {})
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      setFocus(false)
      document.removeEventListener('mousemove', debounceWrap)
    })
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      reviewRef.current.scrollTo({
        top: reviewRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }

  // 获取汇报评论
  const getReportCommentData = async (id: number) => {
    const response = await getReportComment({
      report_user_id: id,
      page: 1,
      pagesize: 999,
    })
    setCommentList(response.list)
  }

  // 获取汇报详情
  const getReportDetail = async (ids?: any) => {
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getReportInfo({
      id: viewReportModal?.id,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
    getReportCommentData(viewReportModal?.id)
  }

  // 关闭弹窗
  const onCancel = () => {
    setFocus(false)
    setIsReview(false)
    dispatch(setViewReportModal({ visible: false, id: 0, ids: [] }))
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = reportIds[currentIndex - 1]
    if (!currentIndex) return
    dispatch(
      setViewReportModal({
        ...viewReportModal,
        ...{ id: newIndex },
      }),
    )
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = reportIds[currentIndex + 1]
    if (currentIndex === reportIds?.length - 1) return

    dispatch(
      setViewReportModal({
        ...viewReportModal,
        ...{ id: newIndex },
      }),
    )
  }

  const getKeyDown = (e: any) => {
    if (storeAll.getState().workReport.viewReportModal.visible) {
      if (e.keyCode === 38) {
        //up
        document.getElementById('upIcon')?.click()
      }
      if (e.keyCode === 40) {
        //down
        document.getElementById('downIcon')?.click()
      }
    }
  }

  // 评论
  const onComment = async () => {
    const value = await form.validateFields()
    const params = {
      report_user_id: drawerInfo.id,
      content: value.info,
    }
    await addReportComment(params)
    message.success('添加评论成功！')
    scrollToBottom()
    setIsReview(false)
    getReportCommentData(drawerInfo.id)
    form.resetFields()
  }

  // 富文本上传
  const uploadFile = (file: File, dom: any, key2?: any) => {
    const key = uploadFileToKey(
      file,
      file.name,
      `richEditorFiles_${new Date().getTime()}`,
      false,
      data => {
        if (key2 === 'copy') {
          dom.past(data.url)
        }
        dom?.notifyUploaded(data.key, data.url)
      },
    )
    return key
  }

  // 判断点击位置是否在抽屉内，关闭抽屉
  const getClickPosition = (e: any) => {
    if (
      viewReportModal.visible &&
      window.innerWidth - e.clientX > leftWidth &&
      !Array.from(document.getElementsByClassName('dragLine')).includes(
        e.target,
      ) &&
      !Array.from(document.getElementsByClassName('summarySpan')).includes(
        e.target,
      )
    ) {
      onCancel()
    }
  }
  useEffect(() => {
    if (viewReportModal.visible && viewReportModal?.id) {
      setReportIds(viewReportModal?.ids || [])
      getReportDetail(viewReportModal?.ids || [])
    }
  }, [viewReportModal])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    document.addEventListener('mousedown', getClickPosition)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
      document.removeEventListener('mousedown', getClickPosition)
    }
  }, [])

  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value === '<p></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }

  return (
    <>
      (
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={viewReportModal.visible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
        getContainer={false}
        className="drawerRoot"
      >
        <DragLine
          onMouseDown={onDragLine}
          style={{ left: 0 }}
          active={focus}
          className="dragLine"
        />
        <Header>
          <Space size={16}>
            <BackIcon onClick={onCancel}>
              <CommonIconFont
                type="right-02"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </BackIcon>
            {skeletonLoading && (
              <SkeletonStatus>
                <Skeleton.Input active />
              </SkeletonStatus>
            )}
          </Space>
          <Space size={16}>
            <ChangeIconGroup>
              {currentIndex > 0 && (
                <UpWrap
                  onClick={onUpDemand}
                  id="upIcon"
                  isOnly={
                    reportIds?.length === 0 ||
                    currentIndex === reportIds?.length - 1
                  }
                >
                  <CommonIconFont
                    type="up"
                    size={20}
                    color="var(--neutral-n1-d1)"
                  />
                </UpWrap>
              )}

              {!(
                reportIds?.length === 0 ||
                currentIndex === reportIds?.length - 1
              ) && (
                <DownWrap
                  onClick={onDownDemand}
                  id="downIcon"
                  isOnly={currentIndex <= 0}
                >
                  <CommonIconFont
                    type="down"
                    size={20}
                    color="var(--neutral-n1-d1)"
                  />
                </DownWrap>
              )}
            </ChangeIconGroup>
          </Space>
        </Header>
        <Content isReview={isReview} ref={reviewRef}>
          {skeletonLoading && <DetailsSkeleton />}
          {!skeletonLoading && (
            <>
              <ContentHeadWrap>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CommonUserAvatar
                    size="large"
                    avatar={drawerInfo?.user?.avatar}
                  />
                  <div className="reportTitleWrap">
                    <div className="titleText">
                      {drawerInfo?.user?.name}的
                      {drawerInfo?.report_template_name}
                      <span className="dateText">
                        （{drawerInfo?.start_time}至{drawerInfo?.end_time}）
                      </span>
                    </div>
                    <div className="submitTimeText">
                      提交时间：{drawerInfo?.created_at}
                    </div>
                  </div>
                </div>
              </ContentHeadWrap>
              {drawerInfo?.report_content?.map((i: any) => (
                <DetailItem key={i.id}>
                  <div className="title">{i.name}</div>
                  {i.type === 1 && (
                    <TargetTabs list={drawerInfo?.target_users} />
                  )}
                  {i.type === 2 && <AttachmentBox list={i?.pivot?.params} />}
                  {i.type === 3 && (
                    <Editor
                      readonly
                      disableUpdateValue
                      value={i?.pivot?.content}
                    />
                  )}
                  {i.type === 4 && <ContactDemand list={i?.pivot?.params} />}
                </DetailItem>
              ))}
              <DetailItem>
                <div className="title">评论</div>
                {commentList.map((i: any) => (
                  <CommentBox key={i.id}>
                    <div className="header">
                      <CommonUserAvatar name={i.comment_user.name} />
                      <div className="time">{i.created_at || '--'}</div>
                    </div>
                    <div className="content">
                      <Editor readonly disableUpdateValue value={i?.content} />
                    </div>
                  </CommentBox>
                ))}
              </DetailItem>
            </>
          )}
        </Content>

        <CommentFooter isReview={isReview}>
          {isReview ? (
            <>
              <div className="editBox">
                <Form form={form}>
                  <Form.Item
                    name="info"
                    rules={[
                      {
                        validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                        required: true,
                        message: (
                          <div
                            style={{
                              margin: '5px 0',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            评论不能为空
                          </div>
                        ),
                        whitespace: true,
                        validator: onValidator,
                      },
                    ]}
                  >
                    <Editor
                      ref={editorRef}
                      upload={uploadFile}
                      getSuggestions={() => []}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="buttonBox">
                <Space>
                  <CommonButton
                    type="light"
                    size="small"
                    onClick={() => {
                      setIsReview(false)
                      form.resetFields()
                    }}
                    style={{ fontSize: 12 }}
                  >
                    取消
                  </CommonButton>
                  <CommonButton
                    type="primary"
                    size="small"
                    style={{ fontSize: 12 }}
                    onClick={onComment}
                  >
                    评论
                  </CommonButton>
                </Space>
              </div>
            </>
          ) : (
            <Input
              placeholder={`评论${drawerInfo?.user?.name || '--'}的日志`}
              onFocus={() => setIsReview(true)}
            />
          )}
        </CommentFooter>
      </Drawer>
      )
    </>
  )
}

export default ReportDetailDrawer
