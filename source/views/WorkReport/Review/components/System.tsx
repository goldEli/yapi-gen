/* eslint-disable camelcase */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, Form, Space } from 'antd'
import type { EditorRef } from '@xyfe/uikit'
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
  ContactDemandBox,
  ContactDemandItem,
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

const ContactDemand = (props: { list: any }) => {
  const list = props.list?.length ? props.list : []
  return (
    <ContactDemandBox>
      {list?.length
        ? list?.map((i: any) => (
            <ContactDemandItem key={i.id}>
              【{i.story_prefix_key}】<span className="name">{i.name}</span>
            </ContactDemandItem>
          ))
        : '--'}
    </ContactDemandBox>
  )
}

const System = () => {
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
  const detail: any = {
    id: 22,
    user_id: 689,
    report_template_id: 26,
    report_precis: '昨日新增：3个任务完成度：10/50已完成10个',
    start_time: '2023-07-27',
    end_time: '2023-07-27 00:00:00',
    is_supply: 2,
    is_read: 1,
    type: 2,
    is_auto: 2,
    created_at: '2023-07-27 17:23:12',
    updated_at: '2023-07-27 17:23:43',
    deleted_at: null,
    project_id: 321,
    report_template_name: '工作汇报',
    submit_cycle: 1,
    target_user_config_id: 114,
    target_users: [
      {
        user_id: 39,
        report_template_id: 26,
        report_user_id: 22,
        type: 1,
        user: {
          id: 39,
          name: ' 汪志君',
          avatar:
            'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-01-30/1622381402%281%29.jpg',
        },
      },
      {
        user_id: 6,
        report_template_id: 26,
        report_user_id: 22,
        type: 1,
        user: {
          id: 6,
          name: '马成龙',
          avatar:
            'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1504303190676344834/2023-04-24/68e19872-c04e-44d4-b4c7-9b86bcd0cfd8.png',
        },
      },
      {
        user_id: 91,
        report_template_id: 26,
        report_user_id: 22,
        type: 1,
        user: {
          id: 91,
          name: '赵日天',
          avatar: '',
        },
      },
      {
        user_id: 42,
        report_template_id: 26,
        report_user_id: 22,
        type: 1,
        user: {
          id: 42,
          name: 'gravel',
          avatar:
            'https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551751383370940418/2023-06-05/79a18410-5c26-46ba-91d9-0f0c158a18a1.jpeg',
        },
      },
      {
        user_id: 689,
        report_template_id: 26,
        report_user_id: 22,
        type: 2,
        user: {
          id: 689,
          name: '蒋晓龙',
          avatar: '',
        },
      },
      {
        user_id: 705,
        report_template_id: 26,
        report_user_id: 22,
        type: 1,
        user: {
          id: 705,
          name: '薛万云',
          avatar: '',
        },
      },
    ],
    report_content: [
      {
        id: 118,
        name: '总进度',
        report_template_id: 26,
        type: 3,
        tips: '',
        sort: 0,
        is_required: 2,
        created_at: '2023-07-26 10:23:03',
        updated_at: '2023-07-27 11:50:57',
        deleted_at: null,
        pivot: {
          report_user_id: 22,
          report_template_config_id: 118,
          content:
            '<p><span style="color: rgb(51, 51, 51); font-family: Arial Normal, Arial, sans-serif; font-size: 14px">昨日新增： 3个</span></p><p>任务完成度： 10/ 50      已完成 10 个</p>',
          params: [],
        },
      },
      {
        id: 115,
        name: '今日截止',
        report_template_id: 26,
        type: 4,
        tips: '',
        sort: 1,
        is_required: 1,
        created_at: '2023-07-25 16:48:14',
        updated_at: '2023-07-27 11:50:57',
        deleted_at: null,
        pivot: {
          report_user_id: 22,
          report_template_config_id: 115,
          content: '',
          params: [
            {
              id: 1002929,
              name: '个人中心（jxl）',
              story_prefix_key: 'CSXM（JXL-1',
            },
            {
              id: 1003010,
              name: '需求测试12（jxl）',
              story_prefix_key: 'CSXM（JXL-2',
            },
          ],
        },
      },
      {
        id: 116,
        name: '预期任务',
        report_template_id: 26,
        type: 4,
        tips: '',
        sort: 2,
        is_required: 1,
        created_at: '2023-07-25 16:48:14',
        updated_at: '2023-07-27 11:50:57',
        deleted_at: null,
        pivot: {
          report_user_id: 22,
          report_template_config_id: 116,
          content: '',
          params: [
            {
              id: 1003154,
              name: '需求层级测试1',
              story_prefix_key: 'CSXM（JXL-4',
            },
            {
              id: 1003156,
              name: '需求层级测试3',
              story_prefix_key: 'CSXM（JXL-6',
            },
          ],
        },
      },
    ],
    user: {
      id: 689,
      name: '蒋晓龙',
      avatar: '',
      company_name: '成都定星科技',
      department_name: 'php',
      job_name: 'php工程师',
    },
    project: {
      id: 321,
      name: '张四146',
      avatar: '',
    },
    title: '蒋晓龙生成的07月27日工作汇报',
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
                    <div className="titleText">{detail?.title}</div>
                    <div className="submitTimeText">
                      {t('report.list.dateSubmit')}：{detail?.created_at}
                    </div>
                  </MsgRow>
                  <div className="submitTimeText">
                    {detail?.user.company_name} - {detail?.user.department_name}{' '}
                    - {detail?.user.job_name}
                  </div>
                </div>
              </div>
            </ContentHeadWrap>
            {/* 新加的ui */}
            <Title>汇报项目</Title>
            <Msg style={{ margin: '8px 0 32px 0' }}>{detail.project.name}</Msg>
            {detail.report_content?.map((item: any) => (
              <Col key={item.id}>
                {item.type === 4 && (
                  <Title style={{ marginBottom: 8 }}>
                    {item.name}: {item.pivot.params?.length}个
                  </Title>
                )}
                {item.type === 3 && (
                  <Title style={{ marginBottom: 8 }}>{item.name}: 80%</Title>
                )}
                {item.type === 3 && (
                  <>
                    <Msg style={{ marginTop: '8px' }}>昨日新增：10个</Msg>
                    <RowLine>
                      <Msg>昨日新增：10个</Msg>
                      <Line></Line>
                      <Msg>昨日新增：10个</Msg>
                    </RowLine>
                  </>
                )}
                {item.type === 4 &&
                  item.pivot.params?.map((el: any) => (
                    <RowRadius key={el.id}>
                      <Radius />
                      <Msg>{el.name}</Msg>
                    </RowRadius>
                  ))}
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

export default System
