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
  updateTableParams,
} from '@/services/demand'
import { getProjectInfo } from '@/services/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setDemandInfo, setIsDemandDetailDrawerVisible } from '@store/demand'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setProjectInfo,
} from '@store/project'
import { Drawer, message, Popover, Skeleton, Space } from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import CommonIconFont from '../CommonIconFont'
import DeleteConfirm from '../DeleteConfirm'
import StateTag from '../StateTag'
import { DragLine, MouseDom } from '../StyleCommon'
import BasicDemand from './BasicDemand'
import ChildrenDemand from './ChildrenDemand'
import DemandComment from './DemandComment'
import DetailDemand from './DetailDemand'
import {
  Header,
  BackIcon,
  ChangeIconGroup,
  Content,
  ParentBox,
  DemandName,
  CollapseItem,
  CollapseItemTitle,
  CollapseItemContent,
  DrawerHeader,
  NextWrap,
  SkeletonStatus,
  UpWrap,
  DownWrap,
} from './style'
import CommonButton from '../CommonButton'
import {
  getDemandCommentList,
  saveDemandDetailDrawer,
} from '@store/demand/demand.thunk'
import { getMessage } from '../Message'
import { DemandOperationDropdownMenu } from '../TableDropdownMenu/DemandDropdownMenu'
import DetailsSkeleton from '../DetailsSkeleton'
import { copyLink } from '@/tools'
import CopyIcon from '../CopyIcon'
import StoryRelation from '@/views/DemandDetail/components/StoryRelation'

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
    relation: {
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
  const { projectInfo, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
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
  const spanDom = useRef<HTMLSpanElement>(null)

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0

  const modeList = [
    { name: t('project.detailInfo'), key: 'detailInfo', content: '' },
    { name: t('common.childDemand'), key: 'detailDemands', content: '' },
    { name: t('associatedWorkItems'), key: 'relation', content: '' },
    { name: t('newlyAdd.basicInfo'), key: 'basicInfo', content: '' },
    { name: t('requirements_review'), key: 'demandComment', content: '' },
  ]
  const leftWidth = 640

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
    info.level_tree.push({
      id: info.id,
      category_id: info.category,
      prefix_key: info.prefixKey,
      project_prefix: info.projectPrefix,
      category_attachment: info.category_attachment,
      parent_id: info.parentId,
      name: info.name,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
  }

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setAddWorkItemModal({
        visible: false,
        params: {},
      }),
    )
    dispatch(setIsDemandDetailDrawerVisible(false))
    dispatch(saveDemandDetailDrawer({}))
    setShowState(normalState)
  }

  // 跳转详情页面
  const onToDetail = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: drawerInfo.projectId,
        demandId: drawerInfo.id,
        newOpen: true,
        changeIds: demandIds,
      }),
    )
    const url = `ProjectManagement/DemandDetail?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(false))
      dispatch(setDemandInfo({}))
    }, 0)
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: item.id,
          projectId: drawerInfo.projectId,
          type: 1,
          title: t('editingRequirements'),
        },
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
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          projectId: drawerInfo.projectId,
          isChild: true,
          parentId: item.id,
          categoryId: item.categoryId,
          type: 1,
          title: t('createSubrequirements'),
        },
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
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  // 快捷修改名称
  const onNameConfirm = async () => {
    const value = spanDom.current?.innerText
    if ((value?.length || 0) <= 0) {
      getMessage({ type: 'warning', msg: t('nameIsRequired') })
      return
    }
    if ((value?.length || 0) > 100) {
      getMessage({ type: 'warning', msg: t('nameCannotExceedCharacters') })
      return
    }
    if (value !== drawerInfo.name) {
      await updateTableParams({
        projectId: drawerInfo.project_id ?? drawerInfo.projectId,
        id: drawerInfo.id,
        otherParams: {
          name: value,
        },
      })
      getMessage({ type: 'success', msg: t('successfullyModified') })
      // 提交名称
      setDrawerInfo({
        ...drawerInfo,
        name: value,
      })
    }
  }

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 修改状态
  const onChangeStatus = async (value: any) => {
    try {
      await updateDemandStatus(value)
      getMessage({ msg: t('common.statusSuccess'), type: 'success' })
      getDemandDetail()
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
      dispatch(
        getDemandCommentList({
          projectId: drawerInfo.projectId,
          demandId: drawerInfo.id,
          page: 1,
          pageSize: 999,
        }),
      )
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
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      setDeleteId(0)
      setIsDelete(false)
      onCancel()
      // 更新列表
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    } catch (error) {
      //
    }
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = demandIds[currentIndex - 1]
    if (!currentIndex) return
    dispatch(
      saveDemandDetailDrawer({
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
      saveDemandDetailDrawer({
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

  // 操作后更新列表
  const onOperationUpdate = (value?: boolean) => {
    getDemandDetail('', demandIds)
    if (!value) {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
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
    if (isUpdateAddWorkItem) {
      setCurrentIndex(0)
      setDemandIds([])
      if (isDemandDetailDrawerVisible) {
        getDemandDetail()
      }
    }
  }, [isUpdateAddWorkItem])

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
        open={isDemandDetailDrawerVisible}
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
                type={1}
              >
                <StateTag
                  name={drawerInfo?.status?.status?.content}
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
              {currentIndex > 0 && (
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
              )}
              {!(
                demandIds?.length === 0 ||
                currentIndex === demandIds?.length - 1
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
            <div onClick={onToDetail}>
              <CommonButton type="icon" icon="full-screen" />
            </div>
            <Popover
              open={isMoreVisible}
              onOpenChange={setIsMoreVisible}
              placement="bottomRight"
              trigger={['click']}
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
              <div>
                <CommonButton type="icon" icon="more" />
              </div>
            </Popover>
          </Space>
        </Header>
        <Content>
          {skeletonLoading && <DetailsSkeleton />}
          {!skeletonLoading && (
            <>
              <ParentBox size={8}>
                {drawerInfo.level_tree?.map((i: any, index: number) => (
                  <DrawerHeader key={i.prefix_key}>
                    <img src={i.category_attachment} alt="" />
                    <div>
                      {i.project_prefix}-{i.prefix_key}
                    </div>
                    <span
                      hidden={
                        drawerInfo.level_tree?.length <= 1 ||
                        index === drawerInfo.level_tree?.length - 1
                      }
                    >
                      /
                    </span>
                  </DrawerHeader>
                ))}
              </ParentBox>
              <DemandName>
                {isCanEdit && (
                  <span
                    className="name"
                    ref={spanDom}
                    contentEditable
                    onBlur={onNameConfirm}
                  >
                    {drawerInfo.name}
                  </span>
                )}
                {!isCanEdit && <span className="name">{drawerInfo.name}</span>}

                <CopyIcon onCopy={onCopy} />
              </DemandName>
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
                        onUpdate={onOperationUpdate}
                      />
                    )}
                    {i.key === 'detailDemands' && showState[i.key].isOpen && (
                      <ChildrenDemand
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                      />
                    )}
                    {i.key === 'relation' && showState[i.key].isOpen && (
                      <StoryRelation
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={onOperationUpdate}
                        isDrawer
                      />
                    )}
                    {i.key === 'basicInfo' && showState[i.key].isOpen && (
                      <BasicDemand
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={onOperationUpdate}
                      />
                    )}
                    {i.key === 'demandComment' && (
                      <DemandComment
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onRef={commentDom}
                        isOpenInfo
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
