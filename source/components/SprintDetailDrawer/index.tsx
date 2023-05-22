import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { setSprintDetailDrawer } from '@store/sprint'
import { Drawer, Popover, Skeleton, Space } from 'antd'
import { DragLine, MouseDom } from '../StyleCommon'
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
import CommonIconFont from '../CommonIconFont'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import StateTag from '../StateTag'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { getMessage } from '../Message'
import DetailsSkeleton from '../DetailsSkeleton'
import ChildSprint from '@/views/SprintProjectDetail/components/ChildSprint'
import LinkSprint from '@/views/SprintProjectDetail/components/LinkSprint'

const SprintDetailDrawer = () => {
  const normalState = {
    detailInfo: {
      isOpen: true,
      dom: useRef<any>(null),
    },
    childSprint: {
      isOpen: false,
      dom: useRef<any>(null),
    },
    linkSprint: {
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
  const [t] = useTranslation()
  const leftWidth = 640
  const dispatch = useDispatch()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [focus, setFocus] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const [showState, setShowState] = useState<any>(normalState)
  const { sprintDetailDrawer } = useSelector(store => store.sprint)
  const { projectInfo } = useSelector(store => store.project)

  const modeList = [
    { name: '详细信息', key: 'detailInfo', content: '' },
    { name: '子事务', key: 'childSprint', content: '' },
    { name: '链接事务', key: 'linkSprint', content: '' },
    { name: '基本信息', key: 'basicInfo', content: '' },
    { name: '事务评论', key: 'demandComment', content: '' },
  ]

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setSprintDetailDrawer({
        visible: false,
        params: {},
      }),
    )
  }

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0

  // 是否审核
  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

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

  // 跳转详情页面
  const onToDetail = () => {
    //
  }

  // 修改状态
  const onChangeStatus = async (value: any) => {
    //
  }

  // 向上查找需求
  const onUpDemand = () => {
    // const newIndex = demandIds[currentIndex - 1]
    // if (!currentIndex) return
    // dispatch(
    //   saveDemandDetailDrawer({
    //     ...demandDetailDrawerProps,
    //     ...{ id: newIndex },
    //   }),
    // )
  }

  // 向下查找需求
  const onDownDemand = () => {
    // const newIndex = demandIds[currentIndex + 1]
    // if (currentIndex === demandIds?.length - 1) return
    // dispatch(
    //   saveDemandDetailDrawer({
    //     ...demandDetailDrawerProps,
    //     ...{ id: newIndex },
    //   }),
    // )
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

  return (
    <>
      <DeleteConfirmModal />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={sprintDetailDrawer.visible}
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
                // onChangeStatus={onChangeStatus}
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
              trigger={['click', 'hover']}
              getPopupContainer={n => n}
              content={
                <div>1</div>
                // <DemandOperationDropdownMenu
                //   haveComment
                //   onEditChange={onEditChange}
                //   onDeleteChange={onDeleteChange}
                //   onCreateChild={onCreateChild}
                //   onAddComment={() => commentDom.current?.addComment()}
                //   record={demandDetailDrawerProps}
                // />
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
                      <div>详细信息</div>
                      // <DetailDemand
                      //   detail={drawerInfo}
                      //   onUpdate={getDemandDetail}
                      // />
                    )}
                    {i.key === 'childSprint' && showState[i.key].isOpen && (
                      <ChildSprint />
                      // <ChildrenDemand
                      //   detail={drawerInfo}
                      //   isOpen={showState[i.key].isOpen}
                      // />
                    )}
                    {i.key === 'linkSprint' && (
                      <LinkSprint />
                      // <DemandComment
                      //   detail={drawerInfo}
                      //   isOpen={showState[i.key].isOpen}
                      //   onRef={commentDom}
                      //   isOpenInfo
                      // />
                    )}
                    {i.key === 'basicInfo' && showState[i.key].isOpen && (
                      <div>基本信息</div>
                      // <BasicDemand
                      //   detail={drawerInfo}
                      //   isOpen={showState[i.key].isOpen}
                      //   onUpdate={getDemandDetail}
                      // />
                    )}
                    {i.key === 'demandComment' && (
                      <div>事务评论</div>
                      // <DemandComment
                      //   detail={drawerInfo}
                      //   isOpen={showState[i.key].isOpen}
                      //   onRef={commentDom}
                      //   isOpenInfo
                      // />
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

export default SprintDetailDrawer
