/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, message, Form, Skeleton, Space, Input, Button } from 'antd'
import { Editor } from '@xyfe/uikit'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import { DragLine } from '@/components/StyleCommon'
import DetailsSkeleton from '@/components/DemandDetailDrawer/DetailsSkeleton'
import { throttle } from 'lodash'
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
  LabelTitle,
  LabelMessage,
  LabelMessageRead,
  CommentFooter,
} from './style'
import { setViewReportModal } from '@store/workReport'
import { getReportInfo } from '@/services/report'

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
  const [form] = Form.useForm()
  const leftWidth = 640

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

  // 获取汇报详情
  const getReportDetail = async (ids?: any) => {
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getReportInfo({
      id: viewReportModal.id,
    })
    console.log(info)
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
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

  useEffect(() => {
    if (viewReportModal.visible || viewReportModal?.id) {
      setReportIds(viewReportModal?.ids || [])
      getReportDetail(viewReportModal?.ids || [])
    }
  }, [viewReportModal])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  return (
    <>
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
        <Content isReview={isReview}>
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
                      {drawerInfo?.user?.name}的工作日报
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
              <Form
                form={form}
                onFinish={confirm}
                layout="vertical"
                initialValues={{ info2: '2222222222' }}
                onFinishFailed={() => {
                  setTimeout(() => {
                    const errorList = (document as any).querySelectorAll(
                      '.ant-form-item-has-error',
                    )

                    errorList[0].scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  }, 100)
                }}
              >
                <Form.Item
                  style={{
                    marginBottom: '30px',
                  }}
                  label={<LabelTitle>{t('report.list.todayWork')}</LabelTitle>}
                  name="info"
                >
                  <Editor readonly disableUpdateValue />
                </Form.Item>
                <Form.Item
                  style={{
                    marginBottom: '30px',
                  }}
                  label={
                    <LabelTitle>{t('report.list.tomorrowWork')}</LabelTitle>
                  }
                  name="info2"
                >
                  <Editor readonly disableUpdateValue />
                </Form.Item>
                <Form.Item
                  label={<LabelTitle>{t('common.attachment')}</LabelTitle>}
                  name="attachments"
                >
                  11111
                </Form.Item>
                <Form.Item
                  label={
                    <LabelTitle>
                      {t('report.list.associatedRequirement')}
                    </LabelTitle>
                  }
                  name="needs"
                >
                  111
                </Form.Item>
              </Form>
              <div>
                <div>
                  <span className={LabelMessage}>已读</span>
                  <span className={LabelMessageRead}>{`未读 (${3})`}</span>
                </div>
              </div>
              <div>
                <div style={{ marginTop: 21 }}>
                  <LabelTitle>评论</LabelTitle>
                </div>
              </div>
            </>
          )}
        </Content>

        <CommentFooter isReview={isReview}>
          {isReview ? (
            <>
              <Editor />
              <div className="buttonBox">
                <Space>
                  <Button type="primary" size="small">
                    评论
                  </Button>
                  <Button
                    type="default"
                    size="small"
                    onClick={() => setIsReview(false)}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            </>
          ) : (
            <Input
              placeholder={`评论${'张三'}的日志`}
              onFocus={() => setIsReview(true)}
            />
          )}
        </CommentFooter>
      </Drawer>
    </>
  )
}

export default ReportDetailDrawer
