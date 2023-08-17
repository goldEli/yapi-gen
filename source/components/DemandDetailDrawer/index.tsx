/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
// 需求详情弹窗预览模式

import {
  addComment,
  deleteComment,
  deleteDemand,
  getDemandInfo,
  updateDemandComment,
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
import {
  Drawer,
  message,
  Popover,
  Skeleton,
  Space,
  Tooltip,
  Tabs,
  Affix,
} from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import CommonIconFont from '../CommonIconFont'
import DeleteConfirm from '../DeleteConfirm'
import StateTag from '../StateTag'
import { CloseWrap, ConfigWrap, DragLine, MouseDom } from '../StyleCommon'
import BasicDemand from './BasicDemand'
import ChildrenDemand from './ChildrenDemand'
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
  DetailFooter,
  CommentTitle,
  LayerBox,
  customTabs,
  BtnWrap,
  CycleBox,
  HandlerBox,
  FixedBox,
  EmptyBox,
  ProgressBox,
} from './style'
import CommonButton from '../CommonButton'
import {
  getDemandCommentList,
  saveDemandDetailDrawer,
} from '@store/demand/demand.thunk'
import { getMessage } from '../Message'
import { DemandOperationDropdownMenu } from '../TableDropdownMenu/DemandDropdownMenu'
import DetailsSkeleton from '../DetailsSkeleton'
import {
  copyLink,
  detailTimeFormat,
  getIdsForAt,
  getParamsData,
  getProjectIdByUrl,
  removeNull,
} from '@/tools'
import CopyIcon from '../CopyIcon'
import StatusExamine from '../StatusExamine'
import { cancelVerify } from '@/services/mine'
import CommentFooter from '../CommonComment/CommentFooter'
import CommonComment from '../CommonComment'
import { setActiveCategory } from '@store/category'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StoryRelation from '../DetailScreenModal/DemandDetail/components/StoryRelation'
import DrawerTopInfo from '../DrawerTopInfo'
import CommonProgress from '../CommonProgress'
import ScheduleRecord from '../ScheduleRecord'
import DemandTag from '../TagComponent/DemandTag'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
interface ItemIprops {
  label: string
  key: string
}

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
      isOpen: true,
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
    demandCommentList,
  } = useSelector(store => store.demand)
  const { projectInfo, isUpdateAddWorkItem, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { userInfo } = useSelector(store => store.user)
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}
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
  const detailDemandRef = useRef<any>()
  const childrenDemandRef = useRef<any>()
  const storyRelationRef = useRef<any>()
  const tabsRef = useRef<any>()
  const [openDemandDetail] = useOpenDemandDetail()
  const projectIdRef = useRef()
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
  const items: ItemIprops[] = [
    {
      key: 'tab_desc',
      label: t('describe'),
    },
    {
      key: 'tab_tag',
      label: t('tag'),
    },
    {
      key: 'tab_attachment',
      label: t('attachment'),
    },
    {
      key: 'tab_demand',
      label: t('subRequirement'),
    },
    {
      key: 'tab_link',
      label: t('linkWorkItem'),
    },
    {
      key: 'tab_info',
      label: t('basicInformation'),
    },
    {
      key: 'tab_log',
      label: t('scheduleRecord'),
    },
    {
      key: 'tab_comment',
      label: t('comment'),
    },
  ]
  const [tabActive, setTabActive] = useState('tab_desc')
  const leftWidth = 960

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
      demandDetailDrawerProps.project_id ??
      demandDetailDrawerProps.projectId ??
      paramsData?.id ??
      projectIdRef.current
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

    const arr = [
      { key: 'detailDemands', count: info.childCount },
      { key: 'relation', count: info.relation_stories },
      { key: 'demandComment', count: info.comment_total },
    ]

    if (info.comment_total) {
      // 获取评论列表
      dispatch(
        getDemandCommentList({
          projectId: paramsProjectId,
          demandId: info.id,
          page: 1,
          pageSize: 999,
        }),
      )
    }

    const newState = Object.assign({}, showState)
    let resState: any

    // 如果有数据的话，则默认展开
    arr.forEach(element => {
      resState = {
        isOpen: element.count,
        dom: newState[element.key].dom,
      }
      newState[element.key] = resState
    })
    setShowState(newState)
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
        detailId: drawerInfo.id,
        changeIds: demandIds,
        specialType: 3,
        isOpenScreenDetail: true,
      }),
    )
    const url = `ProjectManagement/Demand?data=${params}`
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

  //   跳转配置
  const onToConfig = () => {
    onCancel()
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: getProjectIdByUrl(),
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: drawerInfo.category,
          status: drawerInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }

  // 取消审核
  const onCancelExamine = async () => {
    await cancelVerify(drawerInfo.verify_data?.id)
    getMessage({ type: 'success', msg: t('other.cancelExamineSuccess') })
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addComment({
      projectId: projectInfo.id,
      demandId: drawerInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('project.replaySuccess') })
    dispatch(
      getDemandCommentList({
        projectId: drawerInfo.projectId,
        demandId: drawerInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
    commentDom.current.cancel()
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (drawerInfo?.info === value || !value) {
      return
    }
    await updateDemandComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    dispatch(
      getDemandCommentList({
        projectId: drawerInfo.projectId,
        demandId: drawerInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 删除评论确认
  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteComment({ projectId: projectInfo.id, id: commentId })
    getMessage({ type: 'success', msg: t('common.deleteSuccess') })
    dispatch(
      getDemandCommentList({
        projectId: drawerInfo.projectId,
        demandId: drawerInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  useEffect(() => {
    if (isDemandDetailDrawerVisible || demandDetailDrawerProps?.id) {
      setDemandIds(demandDetailDrawerProps?.demandIds || [])
      getDemandDetail('', demandDetailDrawerProps?.demandIds || [])
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
  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 86,
      behavior: 'smooth',
    })
    setTabActive(value)
  }
  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    return
    const { scrollTop } = document.querySelector('#contentDom') as HTMLElement
    // 所有标题节点
    const titleItems = document.querySelectorAll('.info_item_tab')

    let arr: any = []
    titleItems.forEach(element => {
      const { offsetTop, id } = element as HTMLElement
      if (offsetTop - 140 <= scrollTop) {
        const keys = [...arr, ...[id]]
        arr = [...new Set(keys)]
      }
    })
    setTabActive(arr[arr.length - 1])
  }
  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [document.getElementById('contentDom')])

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
          </Space>
          <Space size={16}>
            <ChangeIconGroup>
              {currentIndex > 0 && (
                <Tooltip title={t('previous')}>
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
                </Tooltip>
              )}
              {!(
                demandIds?.length === 0 ||
                currentIndex === demandIds?.length - 1
              ) && (
                <Tooltip title={t('next')}>
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
                </Tooltip>
              )}
            </ChangeIconGroup>
            <Tooltip title={t('openDetails')}>
              <div onClick={onToDetail}>
                <CommonButton type="icon" icon="full-screen" />
              </div>
            </Tooltip>
            <Tooltip title={t('more')}>
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
            </Tooltip>
          </Space>
        </Header>
        <Content id="contentDom">
          {skeletonLoading && <DetailsSkeleton />}
          {!skeletonLoading && (
            <>
              <ParentBox size={8}>
                <div style={{ display: 'flex' }}>
                  {drawerInfo.level_tree?.map((i: any, index: number) => (
                    <DrawerHeader
                      key={i.prefix_key}
                      onClick={() => {
                        // TODO
                        if (demandDetailDrawerProps?.project_id) {
                          projectIdRef.current =
                            demandDetailDrawerProps?.project_id
                        }
                        const projectId = drawerInfo?.projectId
                        if (index !== drawerInfo?.level_tree?.length - 1) {
                          openDemandDetail({ ...i }, projectId, i.id)
                        }
                      }}
                    >
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
                </div>
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
              </ParentBox>
              {drawerInfo?.isExamine && (
                <div style={{ marginBottom: 16 }}>
                  <StatusExamine
                    type={1}
                    onCancel={onCancelExamine}
                    isVerify={drawerInfo?.has_verify === 1}
                    isDrawer
                  />
                </div>
              )}
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
              <ProgressBox>
                <CommonProgress
                  isTable={false}
                  type="demand"
                  id={drawerInfo.id}
                  percent={drawerInfo?.schedule}
                  hasEdit={
                    isCanEdit &&
                    drawerInfo?.user
                      ?.map((i: any) => i?.user?.id)
                      ?.includes(userInfo?.id)
                  }
                  project_id={drawerInfo.projectId}
                  onConfirm={onOperationUpdate}
                />
              </ProgressBox>
              <BtnWrap>
                <CommonButton
                  type="light"
                  onClick={() => {
                    detailDemandRef?.current.handleUpload()
                  }}
                >
                  {t('appendix')}
                </CommonButton>
                <DemandTag
                  defaultList={drawerInfo?.tag?.map((i: any) => ({
                    id: i.id,
                    color: i.tag?.color,
                    name: i.tag?.content,
                  }))}
                  canAdd
                  onUpdate={onOperationUpdate}
                  detail={drawerInfo}
                  isDetailQuick
                  addWrap={
                    <CommonButton type="light">{t('addTag')}</CommonButton>
                  }
                />
                <CommonButton
                  type="light"
                  onClick={() => {
                    childrenDemandRef?.current?.onCreateChild()
                  }}
                >
                  {t('addChildRequirement')}
                </CommonButton>
                <CommonButton
                  type="light"
                  onClick={() => {
                    storyRelationRef?.current.onClickOpen()
                  }}
                >
                  {t('linkWorkItem')}
                </CommonButton>
              </BtnWrap>
              <DrawerTopInfo
                details={drawerInfo}
                onUpdate={() => {
                  getDemandDetail()
                }}
              ></DrawerTopInfo>
              <Tabs
                className="tabs"
                activeKey={tabActive}
                items={items}
                onChange={onChangeTabs}
              ></Tabs>
              <LayerBox>
                <DetailDemand
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  ref={detailDemandRef}
                />
                <ChildrenDemand detail={drawerInfo} ref={childrenDemandRef} />
                <StoryRelation
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  isDrawer
                  ref={storyRelationRef}
                />
                <BasicDemand detail={drawerInfo} onUpdate={onOperationUpdate} />
                <div id="tab_log" className="info_item_tab">
                  <CommentTitle>{t('scheduleRecord')}</CommentTitle>
                  <ScheduleRecord
                    detailId={drawerInfo.id}
                    projectId={drawerInfo.projectId}
                  />
                </div>

                <div id="tab_comment" className="info_item_tab">
                  <CommentTitle>{t('requirements_review')}</CommentTitle>
                  <CommonComment
                    data={demandCommentList}
                    onDeleteConfirm={onDeleteCommentConfirm}
                    onEditComment={onEditComment}
                  />
                </div>
              </LayerBox>
            </>
          )}
          <DetailFooter>
            <div className="textBox">
              <div>
                {t('created')}
                {detailTimeFormat(drawerInfo.createdTime as string)}
              </div>
              <span>
                {t('updated')}
                {detailTimeFormat(drawerInfo.update_at as string)}
              </span>
            </div>
            <ConfigWrap onClick={onToConfig}>
              <CommonIconFont type="settings" />
              <div>{t('configurationFields')}</div>
            </ConfigWrap>
          </DetailFooter>
        </Content>
        <CommentFooter
          onRef={commentDom}
          placeholder={t('postComment')}
          personList={removeNull(projectInfoValues, 'user_name')?.map(
            (k: any) => ({
              label: k.content,
              id: k.id,
            }),
          )}
          onConfirm={onConfirmComment}
          style={{
            padding: '24px 0 24px 24px',
            width: 'calc(100% - 24px)',
            height: 80,
          }}
          maxHeight="60vh"
          hasAvatar
        />
      </Drawer>
    </>
  )
}

export default DemandDetailDrawer
