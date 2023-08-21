/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, Form, Space } from 'antd'
import { Editor } from '@xyfe/uikit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  Header,
  BackIcon,
  MsgRow,
  Content,
  ContentHeadWrap,
  DetailItem,
  TargetUserItem,
  TargetUserContent,
  CommentBox,
  Title,
  Msg,
  RowRadius,
  Radius,
  Line,
  RowLine,
  Col,
} from './style'
import {
  addReportComment,
  getReportComment,
  getReportInfo,
  delReportComment,
} from '@/services/report'
import UploadAttach from '@/components/UploadAttach'
import ReportDetailSkeleton from './ReportDetailSkeleton'
import { saveViewReportDetailDrawer } from '@store/workReport/workReport.thunk'
import { getStaffListAll } from '@/services/staff'
import { getIdsForAt } from '@/tools'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setUpdateList } from '@store/workReport'
import { getMessage } from '@/components/Message'
import CommentFooter from '@/components/CommonComment/CommentFooter'

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

const UserSystemReport = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { viewReportModal } = useSelector(store => store.workReport)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [isReview, setIsReview] = useState(false)
  const [commentList, setCommentList] = useState([])
  const [form] = Form.useForm()
  const [arr, setArr] = useState<any>(null)
  const reviewRef = useRef<any>()
  const leftWidth = 640
  const [userList, setUserList] = useState<any>([])
  const { userInfo } = useSelector(store => store.user)
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)

  // 拖动线条
  const onDragLine = (e: React.MouseEvent) => {
    const drawer: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-content-wrapper',
    )!
    const drawerBody: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-body',
    )!
    const moveHandler = (ev: React.MouseEvent) => {
      setFocus(true)
      drawerBody.style.minWidth = '100%'
      drawerBody.style.right = '0px'
      const nextWidth = innerWidth - ev.clientX
      if (nextWidth <= leftWidth) return
      drawer!.style.width = innerWidth - ev.clientX + 'px'
    }
    drawer.style.transition = '0s'
    // const debounceWrap: any = throttle(moveHandler, 60, {})
    const debounceWrap: any = moveHandler
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      drawer.style.transition = 'all 0.3s'
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
  const getReportDetail = async () => {
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getReportInfo({
      id: viewReportModal?.id,
    })
    setUserList(info?.target_users)
    setDrawerInfo(info)
    setSkeletonLoading(false)
    getReportCommentData(viewReportModal?.id)
  }

  // 关闭弹窗
  const onCancel = () => {
    // 更新List页面
    dispatch(setUpdateList({ isFresh: 3 }))
    setFocus(false)
    setIsReview(false)
    dispatch(saveViewReportDetailDrawer({ visible: false, id: 0, ids: [] }))
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
  const onComment = async (value: any) => {
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
      // 更新List页面
      dispatch(setUpdateList({ isFresh: 1 }))
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
      getReportDetail()
    }
  }, [viewReportModal])

  useEffect(() => {
    init()
    // document.addEventListener('keydown', getKeyDown)
    // return () => {
    //   document.removeEventListener('keydown', getKeyDown)
    // }
  }, [])

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
      <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
        <DragLine active={focus} className="line" style={{ marginLeft: 0 }} />
      </MouseDom>
      <Header>
        <Space size={16}>
          <BackIcon onClick={onCancel}>
            <CommonIconFont
              type="right-02"
              size={20}
              color="var(--neutral-n2)"
            />
          </BackIcon>
        </Space>
      </Header>
      <Content isReview={isReview} ref={reviewRef}>
        {/* 判断显示的无数据 */}
        {skeletonLoading && <ReportDetailSkeleton />}
        {!skeletonLoading && (
          <>
            <ContentHeadWrap>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CommonUserAvatar
                  size="large"
                  avatar={drawerInfo?.user?.avatar}
                />
                <div className="reportTitleWrap">
                  <MsgRow>
                    <div className="titleText">{drawerInfo?.title}</div>
                    <div className="submitTimeText">
                      {t('report.list.dateSubmit')}：{drawerInfo?.created_at}
                    </div>
                  </MsgRow>
                  <div className="submitTimeText">
                    {drawerInfo?.user?.company_name} -{' '}
                    {drawerInfo?.user?.department_name} -{' '}
                    {drawerInfo?.user?.job_name}
                  </div>
                </div>
              </div>
            </ContentHeadWrap>
            {/* 新加的ui */}
            <Title>{t('report.list.reportProject')}</Title>
            <Msg style={{ margin: '8px 0 32px 0' }}>
              {drawerInfo?.project?.name}
            </Msg>
            {drawerInfo.report_content?.map((item: any) => (
              <Col key={item.id}>
                {item.type === 4 && (
                  <Title style={{ marginBottom: 8 }}>
                    {item.name}: {item.pivot.params?.length}
                    {t('report.list.pieces')}
                  </Title>
                )}
                {item.type === 3 && (
                  <Title style={{ marginBottom: 8 }}>
                    {item.name}:{' '}
                    {JSON.parse(item?.pivot?.content ?? null)?.total_schedule}%
                    <span style={{ marginLeft: 16 }}>
                      {t('spent')}：
                      {JSON.parse(item?.pivot?.content ?? null)
                        ?.user_today_total_task_time ?? 0}
                      h
                    </span>
                  </Title>
                )}
                {item.type === 3 && (
                  <>
                    <Msg style={{ marginTop: '8px' }}>
                      {t('report.list.addedYesterday')}：
                      {JSON.parse(item?.pivot?.content ?? null)?.yesterday_add}
                      {t('report.list.pieces')}
                    </Msg>
                    <RowLine>
                      <Msg>
                        {t('report.list.taskProgress')}：
                        {
                          JSON.parse(item?.pivot?.content ?? null)
                            ?.task_completion
                        }
                      </Msg>
                      <Line></Line>
                      <Msg>
                        {t('completed')}：{' '}
                        {JSON.parse(item?.pivot?.content ?? null)?.complete}
                        {t('report.list.pieces')}{' '}
                      </Msg>
                    </RowLine>
                  </>
                )}
                {item.type === 4 &&
                  item.pivot.params?.map((el: any) => (
                    <RowRadius key={el.id}>
                      <Radius />
                      {item?.key === 'timeout_task' && el.expected_day > 0 ? (
                        <span style={{ marginRight: 3 }}>
                          [{t('report.list.overdue')}
                          {el.expected_day}
                          {t('report.list.day')}]
                        </span>
                      ) : null}
                      <Msg>
                        {el.name}
                        {`（${
                          el.user_schedule_percent
                            ? el.user_schedule_percent
                            : 0
                        }%  ${el.user_today_task_time ?? 0}h）`}
                      </Msg>
                    </RowRadius>
                  ))}
                {item.type === 2 && (
                  <>
                    <Title>{item?.name}</Title>
                    <AttachmentBox list={item?.pivot?.params} />
                  </>
                )}
              </Col>
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
                            className="deleteIcon"
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
      <CommentFooter
        placeholder={`${t('common.comment')}${
          drawerInfo?.user?.name || '--'
        }${t('report.list.log')}`}
        personList={arr}
        onConfirm={onComment}
        style={{ padding: 24 }}
        maxHeight="72vh"
      />
      <DeleteConfirm
        text={t('mark.cd')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
    </Drawer>
  )
}

export default UserSystemReport
