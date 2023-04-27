/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, message, Form, Space, Input } from 'antd'
import type { EditorRef } from '@xyfe/uikit'
import { Editor } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import { DragLine } from '@/components/StyleCommon'
import { throttle } from 'lodash'
import { uploadFileToKey } from '@/services/cos'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  Header,
  BackIcon,
  ChangeIconGroup,
  Content,
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
import {
  addReportComment,
  getReportComment,
  getReportInfo,
  delReportComment,
} from '@/services/report'
import UploadAttach from '@/components/UploadAttach'
import CommonButton from '@/components/CommonButton'
import ReportDetailSkeleton from './ReportDetailSkeleton'
import { saveViewReportDetailDrawer } from '@store/workReport/workReport.thunk'
import { getStaffListAll } from '@/services/staff'
import { getIdsForAt } from '@/tools'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setUpdateList } from '@store/workReport'
import { getMessage } from '@/components/Message'

interface TargetTabsProps {
  list: any
}

// 已读未读
const TargetTabs = (props: TargetTabsProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [t] = useTranslation()
  return (
    <TargetUserItem>
      <div className="tabs">
        <span
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => setActiveTab(0)}
        >
          {t('p2.haveRead')} (
          {props.list?.filter((k: any) => k.type !== 1)?.length})
        </span>
        <span
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => setActiveTab(1)}
        >
          {t('p2.noRead')} (
          {props.list?.filter((k: any) => k.type === 1)?.length})
        </span>
      </div>
      <TargetUserContent size={24}>
        {props.list
          ?.filter((k: any) =>
            (activeTab === 1 ? [1] : [2, 3]).includes(k.type),
          )
          ?.map((i: any) => (
            <div key={i.user_id}>
              <CommonUserAvatar avatar={i.user?.avatar} name={i.user?.name} />
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
      {list?.length
        ? list?.map((i: any) => (
            <ContactDemandItem key={i.id}>
              【{i.id}】<span className="name">{i.name}</span>
            </ContactDemandItem>
          ))
        : '--'}
    </ContactDemandBox>
  )
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
  const [arr, setArr] = useState<any>(null)
  const reviewRef = useRef<any>()
  const leftWidth = 640
  const editorRef = useRef<EditorRef>(null)
  const [userList, setUserList] = useState<any>([])
  const { userInfo } = useSelector(store => store.user)
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)

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
      if (nextWidth <= leftWidth) {
        return
      }
      drawer!.style.width = `${innerWidth - ev.clientX}px`
    }
    const debounceWrap: any = throttle(moveHandler, 60, {})
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      setFocus(false)
      document.removeEventListener('mousemove', debounceWrap)
    })
  }
  const init = async () => {
    const companyList = await getStaffListAll({ all: 1 })

    const filterCompanyList = companyList.map((item: any) => ({
      id: item.id,

      label: item.name,
    }))
    setArr(filterCompanyList)
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
    return list?.length ? (
      <UploadAttach isReport canUpdate power defaultList={resultList} />
    ) : (
      <span>--</span>
    )
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
    setUserList(info?.target_users)
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
    dispatch(saveViewReportDetailDrawer({ visible: false, id: 0, ids: [] }))
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = reportIds[currentIndex - 1]
    if (!currentIndex) {
      return
    }
    dispatch(
      saveViewReportDetailDrawer({
        ...viewReportModal,
        ...{ id: newIndex },
      }),
    )
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = reportIds[currentIndex + 1]
    if (currentIndex === reportIds?.length - 1) {
      return
    }
    dispatch(
      saveViewReportDetailDrawer({
        ...viewReportModal,
        ...{ id: newIndex },
      }),
    )
  }

  // 键盘上下键事件监听
  const getKeyDown = (e: any) => {
    if (storeAll.getState().workReport.viewReportModal.visible) {
      if (e.keyCode === 38) {
        // up
        document.getElementById('upIcon')?.click()
      }
      if (e.keyCode === 40) {
        // down
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
      a_user_ids: getIdsForAt(value.info),
    }
    await addReportComment(params)
    getMessage({ msg: t('report.list.okComment'), type: 'success' })
    scrollToBottom()
    setIsReview(false)
    getReportCommentData(drawerInfo.id)
    const info = await getReportInfo({
      id: viewReportModal?.id,
    })
    setUserList(info?.target_users)
    form.resetFields()
    // 更新List页面
    dispatch(setUpdateList({ isFresh: 1 }))
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

  // 关闭汇报抽屉
  const onCloseDemandDetail = (e: any) => {
    if (!storeAll.getState().workReport.viewReportModal.visible) {
      return
    }
    if (
      typeof e.target?.parentElement?.className !== 'string' ||
      typeof e.target?.className !== 'string' ||
      (!e.target?.parentElement?.className?.includes('canClickDetail') &&
        !e.target?.className?.includes('canClickDetail') &&
        storeAll.getState().workReport.viewReportModal.visible)
    ) {
      dispatch(saveViewReportDetailDrawer({ visible: false }))
    }
  }

  useEffect(() => {
    document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
    return document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
  }, [document.getElementById('layoutWrap')])

  useEffect(() => {
    if (viewReportModal.visible && viewReportModal?.id) {
      setReportIds(viewReportModal?.ids || [])
      getReportDetail(viewReportModal?.ids || [])
    }
  }, [viewReportModal])

  useEffect(() => {
    init()
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
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

  // 删除评论
  const onDeleteComment = (item: any) => {
    setIsVisible(true)
    setIsDeleteId(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await delReportComment({
        report_user_id: viewReportModal?.id,
        id: isDeleteId,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setIsDeleteId(0)
      setIsVisible(false)
      getReportCommentData(viewReportModal?.id)
      // 更新List页面
      dispatch(setUpdateList({ isFresh: 1 }))
    } catch (error) {
      //
    }
  }

  return (
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
      <DragLine onMouseDown={onDragLine} style={{ left: 0 }} active={focus} />
      <Header>
        <Space size={16}>
          <BackIcon onClick={onCancel}>
            <CommonIconFont
              type="right-02"
              size={20}
              color="var(--neutral-n1-d1)"
            />
          </BackIcon>
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
              reportIds?.length === 0 || currentIndex === reportIds?.length - 1
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
        {skeletonLoading && <ReportDetailSkeleton />}
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
                    {drawerInfo?.user?.name}
                    {t('report.list.of')}
                    {drawerInfo?.report_template_name}
                    <span className="dateText">
                      {drawerInfo?.submit_cycle === 4
                        ? null
                        : `（${drawerInfo?.start_time} ${t(
                            'report.list.to',
                          )} ${drawerInfo?.end_time?.substring(
                            0,
                            drawerInfo?.end_time?.indexOf(' '),
                          )}）`}
                    </span>
                  </div>
                  <div className="submitTimeText">
                    {t('report.list.dateSubmit')}：{drawerInfo?.created_at}
                  </div>
                </div>
              </div>
            </ContentHeadWrap>
            {drawerInfo?.report_content?.map((i: any) => (
              <DetailItem key={i.id}>
                <div className="title">{i.name}</div>
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
            {drawerInfo?.target_users?.length > 0 && (
              <TargetTabs list={userList} />
            )}
            <DetailItem>
              <div className="title">{t('common.comment')}</div>
              {commentList && commentList.length
                ? commentList.map((i: any) => (
                    <CommentBox key={i.id}>
                      <div className="headWrap">
                        <div className="header">
                          <CommonUserAvatar name={i.comment_user.name} />
                          <div className="time">{i.created_at || '--'}</div>
                        </div>
                        {userInfo?.id === i.comment_user.id ? (
                          <IconFont
                            style={{ marginLeft: 20 }}
                            type="close"
                            onClick={() => onDeleteComment(i)}
                          />
                        ) : null}
                      </div>
                      <div className="content">
                        <Editor
                          readonly
                          disableUpdateValue
                          value={i?.content}
                        />
                      </div>
                    </CommentBox>
                  ))
                : '--'}
            </DetailItem>
          </>
        )}
      </Content>

      {!skeletonLoading && (
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
                            {t('report.list.noEmpty')}
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
                      getSuggestions={() => arr}
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
                    {t('report.list.cancel')}
                  </CommonButton>
                  <CommonButton
                    type="primary"
                    size="small"
                    style={{ fontSize: 12 }}
                    onClick={onComment}
                  >
                    {t('common.comment')}
                  </CommonButton>
                </Space>
              </div>
            </>
          ) : (
            <Input
              placeholder={`${t('common.comment')}${
                drawerInfo?.user?.name || '--'
              }${t('report.list.log')}`}
              onFocus={() => {
                setIsReview(true)
                setTimeout(() => {
                  editorRef.current?.focus()
                }, 50)
              }}
            />
          )}
        </CommentFooter>
      )}
      <DeleteConfirm
        text={t('mark.cd')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
    </Drawer>
  )
}

export default ReportDetailDrawer
