/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
// 需求详情弹窗预览模式

import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'
import { getDemandInfo } from '@/services/demand'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { Drawer, Popover, Space } from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import CommonIconFont from '../CommonIconFont'
import { DemandOperationDropdownMenu } from '../DemandComponent/DemandOperationDropdownMenu'
import BasicDemand from './BasicDemand'
import ChildrenDemand from './ChildrenDemand'
import DemandComment from './DemandComment'
import DetailDemand from './DetailDemand'
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
  const dispatch = useDispatch()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [showState, setShowState] = useState<any>(normalState)
  const commentDom: any = createRef()
  const [openDemandDetail] = useOpenDemandDetail()

  const modeList = [
    { name: '详细信息', key: 'detailInfo', content: '' },
    { name: '子需求', key: 'detailDemands', content: '' },
    { name: '基本信息', key: 'basicInfo', content: '' },
    { name: '需求评论', key: 'demandComment', content: '' },
  ]

  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId:
        demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取需求详情
  const getDemandDetail = async () => {
    const info = await getDemandInfo({
      projectId:
        demandDetailDrawerProps.project_id ?? demandDetailDrawerProps.projectId,
      id: demandDetailDrawerProps?.id,
    })
    setDrawerInfo(info)
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
    openDemandDetail(drawerInfo, drawerInfo.projectId, drawerInfo.id)
  }

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    // setComputedTopId(demandDetailDrawerProps?.topId)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        demandId: item.id,
        projectId: demandDetailDrawerProps.project_id,
      }),
    )
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsMoreVisible(false)
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
        projectId:
          demandDetailDrawerProps.project_id ??
          demandDetailDrawerProps.projectId,
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

  useEffect(() => {
    if (isDemandDetailDrawerVisible) {
      getDemandDetail()
      getProjectData()
    }
  }, [isDemandDetailDrawerVisible])

  return (
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
          进行中
        </Space>
        <Space size={16}>
          <ChangeIconGroup>
            <div>
              <CommonIconFont
                type="up"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </div>
            <div>
              <CommonIconFont
                type="down"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </div>
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
              <CommonIconFont type="more" size={20} color="var(--neutral-n2)" />
            </ChangeIconBox>
          </Popover>
        </Space>
      </Header>
      <Content>
        <ParentBox size={8}>
          <span>12212</span>
          <span>1121212</span>
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
                <DetailDemand detail={drawerInfo} onUpdate={getDemandDetail} />
              )}
              {i.key === 'detailDemands' && (
                <ChildrenDemand
                  detail={drawerInfo}
                  isOpen={showState[i.key].isOpen}
                />
              )}
              {i.key === 'basicInfo' && (
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
      </Content>
    </Drawer>
  )
}

export default DemandDetailDrawer
