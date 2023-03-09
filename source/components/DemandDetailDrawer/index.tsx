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
} from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo } from '@store/project'
import { Drawer, message, Popover, Skeleton, Space } from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '../ChangeStatusPopover'
import CommonIconFont from '../CommonIconFont'
import DeleteConfirm from '../DeleteConfirm'
import { DemandOperationDropdownMenu } from '../DemandComponent/DemandOperationDropdownMenu'
import StateTag from '../StateTag'
import BasicDemand from './BasicDemand'
import ChildrenDemand from './ChildrenDemand'
import DemandComment from './DemandComment'
import DetailDemand from './DetailDemand'
import DetailsSkeleton from './DetailsSkeleton'
import {
  Header,
  BackIcon,
  ChangeIconGroup,
  ChangeIconBox,
  Content,
  ParentBox,
  DemandName,
  CollapseItem,
  CollapseItemTitle,
  CollapseItemContent,
  DrawerHeader,
  NextWrap,
  SkeletonStatus,
} from './style'

const DemandDetailDrawer = () => {
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
  const { isDemandDetailDrawerVisible, demandDetailDrawerProps } = useSelector(
    store => store.demand,
  )
  const { projectInfo } = useSelector(store => store.project)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(0)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [showState, setShowState] = useState<any>(normalState)
  const [currentIndex, setCurrentIndex] = useState(0)
  const commentDom: any = createRef()

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const modeList = [
    { name: '详细信息', key: 'detailInfo', content: '' },
    { name: '子需求', key: 'detailDemands', content: '' },
    { name: '基本信息', key: 'basicInfo', content: '' },
    { name: '需求评论', key: 'demandComment', content: '' },
  ]

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId:
        demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取需求详情
  const getDemandDetail = async (id?: any) => {
    setDrawerInfo({})
    setShowState(normalState)
    setSkeletonLoading(true)
    const info = await getDemandInfo({
      projectId:
        demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId,
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
    setCurrentIndex(
      (demandDetailDrawerProps?.demandIds || []).findIndex(
        (i: any) => i === info.id,
      ),
    )
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
    const url = `/ProjectManagement/Demand?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    // setComputedTopId(demandDetailDrawerProps?.topId)
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
    // props.onDelete(item)
    // setComputedTopId(item?.topId)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    // setComputedTopId(item?.topId)
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        projectId: drawerInfo.projectId,
        isChild: true,
        parentId: item.id,
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
    const newIndex = demandDetailDrawerProps.demandIds[currentIndex - 1]
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
    const newIndex = demandDetailDrawerProps.demandIds[currentIndex + 1]
    if (currentIndex === demandDetailDrawerProps.demandIds?.length - 1) return

    dispatch(
      setDemandDetailDrawerProps({
        ...demandDetailDrawerProps,
        ...{ id: newIndex },
      }),
    )
  }

  useEffect(() => {
    if (isDemandDetailDrawerVisible || demandDetailDrawerProps?.id) {
      getDemandDetail()
      getProjectData()
    }
  }, [demandDetailDrawerProps, isDemandDetailDrawerVisible])

  return (
    <>
      <DeleteConfirm
        text={t('mark.del')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <Drawer
        headerStyle={{ width: '100%' }}
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0 }}
        width={640}
        open={isDemandDetailDrawerVisible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
      >
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
            {!skeletonLoading && (
              <ChangeStatusPopover
                isCanOperation={isCanEdit && !drawerInfo.isExamine}
                projectId={drawerInfo.projectId}
                record={drawerInfo}
                onChangeStatus={onChangeStatus}
              >
                <StateTag
                  name={drawerInfo.name}
                  onClick={drawerInfo.isExamine ? onExamine : void 0}
                  isShow={isCanEdit || drawerInfo.isExamine}
                  state={
                    drawerInfo?.status?.is_start === 1 &&
                    drawerInfo?.status?.is_end === 2
                      ? 1
                      : drawerInfo?.status?.is_end === 1 &&
                        drawerInfo?.status?.is_start === 2
                      ? 2
                      : drawerInfo?.status?.is_start === 2 &&
                        drawerInfo?.status?.is_end === 2
                      ? 3
                      : 0
                  }
                />
              </ChangeStatusPopover>
            )}
          </Space>
          <Space size={16}>
            <ChangeIconGroup>
              <NextWrap isDisable={!currentIndex} onClick={onUpDemand}>
                <CommonIconFont
                  type="up"
                  size={20}
                  color="var(--neutral-n1-d1)"
                />
              </NextWrap>
              <NextWrap
                isDisable={
                  currentIndex === demandDetailDrawerProps.demandIds?.length - 1
                }
                onClick={onDownDemand}
              >
                <CommonIconFont
                  type="down"
                  size={20}
                  color="var(--neutral-n1-d1)"
                />
              </NextWrap>
            </ChangeIconGroup>
            <ChangeIconBox onClick={onToDetail}>
              <CommonIconFont
                type="full-screen"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </ChangeIconBox>
            <Popover
              open={isMoreVisible}
              onOpenChange={setIsMoreVisible}
              placement="bottomRight"
              trigger={['click', 'hover']}
              getPopupContainer={n => n}
              content={
                <DemandOperationDropdownMenu
                  haveComment
                  onEditChange={onEditChange}
                  onDeleteChange={onDeleteChange}
                  onCreateChild={onCreateChild}
                  onAddComment={() => commentDom.current?.addComment()}
                  record={demandDetailDrawerProps}
                />
              }
            >
              <ChangeIconBox>
                <CommonIconFont
                  type="more"
                  size={20}
                  color="var(--neutral-n2)"
                />
              </ChangeIconBox>
            </Popover>
          </Space>
        </Header>
        <Content>
          {skeletonLoading && <DetailsSkeleton />}
          {!skeletonLoading && (
            <>
              <ParentBox size={8}>
                {drawerInfo.hierarchy?.map((i: any, index: number) => (
                  <DrawerHeader key={i.prefixKey}>
                    <img src={i.categoryAttachment} alt="" />
                    <div>
                      {i.projectPrefix}-{i.prefixKey}
                    </div>
                    <span
                      hidden={
                        drawerInfo.hierarchy?.length <= 1 ||
                        index === drawerInfo.hierarchy?.length - 1
                      }
                    >
                      /
                    </span>
                  </DrawerHeader>
                ))}
              </ParentBox>
              <DemandName>{drawerInfo.name}</DemandName>
              {modeList.map((i: any) => (
                <CollapseItem key={i.key}>
                  <CollapseItemTitle onClick={() => onChangeShowState(i)}>
                    <span>{i.name}</span>
                    <CommonIconFont
                      type={showState[i.key].isOpen ? 'up' : 'down'}
                      color="var(--neutral-n2)"
                    />
                  </CollapseItemTitle>
                  <CollapseItemContent
                    ref={showState[i.key].dom}
                    isOpen={showState[i.key].isOpen}
                  >
                    {i.key === 'detailInfo' && (
                      <DetailDemand
                        detail={drawerInfo}
                        onUpdate={getDemandDetail}
                      />
                    )}
                    {i.key === 'detailDemands' && showState[i.key].isOpen && (
                      <ChildrenDemand
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                      />
                    )}
                    {i.key === 'basicInfo' && showState[i.key].isOpen && (
                      <BasicDemand
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={getDemandDetail}
                      />
                    )}
                    {i.key === 'demandComment' && (
                      <DemandComment
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onRef={commentDom}
                      />
                    )}
                  </CollapseItemContent>
                </CollapseItem>
              ))}
            </>
          )}
        </Content>
      </Drawer>
    </>
  )
}

export default DemandDetailDrawer
