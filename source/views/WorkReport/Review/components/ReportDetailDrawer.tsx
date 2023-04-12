/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */

// 需求详情弹窗预览模式

import {
  deleteDemand,
  getDemandInfo,
  updateDemandStatus,
} from '@/services/demand'
import { getProjectInfo } from '@/services/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import {
  setCreateDemandProps,
  setDemandDetailDrawerProps,
  setIsCreateDemandVisible,
  setIsUpdateDemand,
} from '@store/demand'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { setProjectInfo } from '@store/project'
import { Drawer, message, Form, Skeleton, Space, Input, Button } from 'antd'
import type { EditorRef } from '@xyfe/uikit'
import UploadAttach from '@/components/UploadAttach'
import { Editor } from '@xyfe/uikit'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import { DragLine } from '@/components/StyleCommon'
import DetailsSkeleton from '@/components/DemandDetailDrawer/DetailsSkeleton'
import { divide, throttle } from 'lodash'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
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
import DemandComment from '@/components/DemandDetailDrawer/DemandComment'

const ReportDetailDrawer = () => {
  const normalState = {
    detailInfo: {
      isOpen: true,
      dom: useRef<any>(null),
    },
    detailDemands: {
      isOpen: false,
      dom: useRef<any>(null),
    },
    basicInfo: {
      isOpen: false,
      dom: useRef<any>(null),
    },
    demandComment: {
      isOpen: false,
      dom: useRef<any>(null),
    },
  }
  const {
    isDemandDetailDrawerVisible,
    demandDetailDrawerProps,
    isUpdateDemand,
  } = useSelector(store => store.demand)
  const { projectInfo } = useSelector(store => store.project)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [focus, setFocus] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [showState, setShowState] = useState<any>(normalState)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const commentDom: any = createRef()
  const [form] = Form.useForm()
  const [isReview, setIsReview] = useState(false)

  const modeList = [
    { name: t('project.detailInfo'), key: 'detailInfo', content: '' },
    { name: t('common.childDemand'), key: 'detailDemands', content: '' },
    { name: t('newlyAdd.basicInfo'), key: 'basicInfo', content: '' },
    { name: t('requirements_review'), key: 'demandComment', content: '' },
  ]
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

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId:
        demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取需求详情
  const getDemandDetail = async (id?: any, ids?: any) => {
    const paramsProjectId =
      demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId
    if (demandDetailDrawerProps?.isAllProject) {
      getProjectData()
    }
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getDemandInfo({
      projectId: paramsProjectId,
      id: id ? id : demandDetailDrawerProps?.id,
    })
    info.hierarchy.push({
      id: info.id,
      categoryId: info.category,
      prefixKey: info.prefixKey,
      projectPrefix: info.projectPrefix,
      categoryAttachment: info.category_attachment,
      parentId: info.parentId,
      name: info.name,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
  }

  // 关闭弹窗
  const onCancel = () => {
    dispatch({
      type: 'demand/setIsDemandDetailDrawerVisible',
      payload: false,
    })
    dispatch(setCreateDemandProps({}))
    dispatch({
      type: 'demand/setDemandDetailDrawerProps',
      payload: {},
    })
    setShowState(normalState)
  }

  // 跳转详情页面
  const onToDetail = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: drawerInfo.projectId,
        demandId: drawerInfo.id,
      }),
    )
    const url = `ProjectManagement/Demand?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        demandId: item.id,
        projectId: drawerInfo.projectId,
      }),
    )
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsMoreVisible(false)
    setDeleteId(item.id)
    setIsDelete(true)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        projectId: drawerInfo.projectId,
        isChild: true,
        parentId: item.id,
        categoryId: item.categoryId,
      }),
    )
  }

  // 改变模块显示
  const onChangeShowState = (item: any) => {
    const newState = Object.assign({}, showState)
    const resState = {
      isOpen: !newState[item.key].isOpen,
      dom: newState[item.key].dom,
    }
    newState[item.key].dom.current.style.height = resState.isOpen ? 'auto' : 0
    newState[item.key] = resState
    setShowState(newState)
  }

  // 是否审核
  const onExamine = () => {
    message.warning(t('newlyAdd.underReview'))
  }

  // 修改状态
  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getDemandDetail()
      dispatch(setIsUpdateDemand(true))
    } catch (error) {
      //
    }
  }

  // 删除需求
  const onDeleteConfirm = async () => {
    try {
      await deleteDemand({
        projectId: drawerInfo.projectId,
        id: deleteId,
      })
      message.success(t('common.deleteSuccess'))
      setDeleteId(0)
      setIsDelete(false)
      onCancel()
      // 更新列表
    } catch (error) {
      //
    }
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = demandIds[currentIndex - 1]
    if (!currentIndex) return
    dispatch(
      setDemandDetailDrawerProps({
        ...demandDetailDrawerProps,
        ...{ id: newIndex },
      }),
    )
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = demandIds[currentIndex + 1]
    if (currentIndex === demandIds?.length - 1) return

    dispatch(
      setDemandDetailDrawerProps({
        ...demandDetailDrawerProps,
        ...{ id: newIndex },
      }),
    )
  }

  const getKeyDown = (e: any) => {
    if (storeAll.getState().demand.isDemandDetailDrawerVisible) {
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
    if (isDemandDetailDrawerVisible || demandDetailDrawerProps?.id) {
      setDemandIds(demandDetailDrawerProps?.demandIds || [])
      getDemandDetail('', demandDetailDrawerProps?.demandIds || [])
      setShowState(normalState)
    }
  }, [demandDetailDrawerProps, isDemandDetailDrawerVisible])

  useEffect(() => {
    if (isUpdateDemand) {
      setCurrentIndex(0)
      setDemandIds([])
      if (isDemandDetailDrawerVisible) {
        getDemandDetail()
      }
    }
  }, [isUpdateDemand])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  return (
    <>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={true}
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
              <UpWrap
                onClick={onUpDemand}
                id="upIcon"
                isOnly={
                  demandIds?.length === 0 ||
                  currentIndex === demandIds?.length - 1
                }
              >
                <CommonIconFont
                  type="up"
                  size={20}
                  color="var(--neutral-n1-d1)"
                />
              </UpWrap>

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
                  {false ? (
                    <img
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                      }}
                      // src={i.avatar}
                    />
                  ) : (
                    <span>
                      <CommonUserAvatar size="large" />
                    </span>
                  )}
                  <div className="reportTitleWrap">
                    <div className="titleText">
                      李四的工作日报
                      <span className="dateText">
                        （2022-08-21至2022-08-27）
                      </span>
                    </div>
                    <div className="submitTimeText">
                      提交时间：2023-09-12 15:20:32
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
          <DemandComment detail={drawerInfo} isOpen={true} onRef={commentDom} />
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
