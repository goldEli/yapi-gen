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
  setDrawerInfo,
  setIsUpdateAddWorkItem,
  setProjectInfo,
} from '@store/project'
import { Drawer, Popover, Skeleton, Space, Tooltip, Tabs } from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import CommonIconFont from '../CommonIconFont'
import DeleteConfirm from '../DeleteConfirm'
import StateTag from '../StateTag'
import { ConfigWrap, DragLine, MouseDom } from '../StyleCommon'
import BasicDemand from './BasicDemand'
import ChildrenDemand from './ChildrenDemand'
import DetailDemand from './DetailDemand'
import {
  Header,
  ChangeIconGroup,
  Content,
  ParentBox,
  DemandName,
  DrawerHeader,
  SkeletonStatus,
  DetailFooter,
  CommentTitle,
  LayerBox,
  BtnWrap,
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
import DemandTag from '../TagComponent/DemandTag'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { myTreeCss } from '../DetailScreenModal/DemandDetail'
import { toggleStar } from '@/services/employeeProfile'
import { setTaskDrawerUpdate } from '@store/employeeProfile'
import LeftIcontButton from '../LeftIcontButton'
import { Label } from '../DetailScreenModal/FlawDetail/style'
interface ItemIprops {
  label: string
  key: string
}
const DemandDetailDrawer = () => {
  const {
    isDemandDetailDrawerVisible,
    demandDetailDrawerProps,
    demandCommentList,
  } = useSelector(store => store.demand)
  const { projectInfo, isUpdateAddWorkItem, projectInfoValues, drawerInfo } =
    useSelector(store => store.project)
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const commentDom: any = createRef()
  const spanDom = useRef<HTMLSpanElement>(null)
  const detailDemandRef = useRef<any>()
  const childrenDemandRef = useRef<any>()
  const storyRelationRef = useRef<any>()
  const [openDemandDetail] = useOpenDemandDetail()
  const projectIdRef = useRef()
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0

  const items: ItemIprops[] = [
    {
      key: 'tab_desc',
      label: t('describe'),
    },
    {
      key: 'tab_log',
      label: t('scheduleRecord'),
    },
    {
      key: 'tab_attachment',
      label: t('attachment'),
    },
    {
      key: 'tab_tag',
      label: t('tag'),
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
      key: 'tab_comment',
      label: t('demandComment'),
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
  const getDemandDetail = async (isInit?: any, ids?: any) => {
    const paramsProjectId =
      demandDetailDrawerProps.project_id ??
      demandDetailDrawerProps.projectId ??
      paramsData?.id ??
      projectIdRef.current
    if (
      demandDetailDrawerProps?.isAllProject ||
      demandDetailDrawerProps?.isPreview
    ) {
      getProjectData()
    }
    if (isInit) {
      setSkeletonLoading(true)
    }
    const info = await getDemandInfo({
      projectId: paramsProjectId,
      id: demandDetailDrawerProps?.id,
    })
    // info.level_tree.push({
    //   id: info.id,
    //   category_id: info.category,
    //   prefix_key: info.prefixKey,
    //   project_prefix: info.projectPrefix,
    //   category_attachment: info.category_attachment,
    //   parent_id: info.parentId,
    //   name: info.name,
    // })
    dispatch(setDrawerInfo(info))
    if (isInit) {
      setSkeletonLoading(false)
    }
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))

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
          parentList: item.parent,
          categoryId: item.categoryId,
          type: 1,
          title: t('createSubrequirements'),
        },
      }),
    )
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
      dispatch(
        setDrawerInfo({
          ...drawerInfo,
          name: value,
        }),
      )
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
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
      if (demandDetailDrawerProps?.isPreview) {
        dispatch(setProjectInfo({}))
      }
      setDemandIds(demandDetailDrawerProps?.demandIds || [])
      getDemandDetail(true, demandDetailDrawerProps?.demandIds || [])
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
    setTabActive(value)
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 86,
      behavior: 'smooth',
    })
  }
  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    if (!document.querySelector('#contentDom')) {
      return
    }
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
            <LeftIcontButton
              danger
              onClick={onCancel}
              icon="close"
              text={t('closure')}
            />
            {skeletonLoading && (
              <SkeletonStatus>
                <Skeleton.Input active />
              </SkeletonStatus>
            )}
          </Space>
          <Space size={16}>
            {!demandDetailDrawerProps.star && (
              <>
                <ChangeIconGroup>
                  {currentIndex > 0 && (
                    <LeftIcontButton
                      onClick={onUpDemand}
                      icon="up-md"
                      text={t('previous')}
                    />
                  )}
                  {!(
                    demandIds?.length === 0 ||
                    currentIndex === demandIds?.length - 1
                  ) && (
                    <LeftIcontButton
                      onClick={onDownDemand}
                      icon="down-md"
                      text={t('next')}
                    />
                  )}
                </ChangeIconGroup>

                <div onClick={onToDetail}>
                  <LeftIcontButton icon="full-screen" text={t('openDetails')} />
                  {/* <CommonButton type="icon" icon="full-screen" /> */}
                </div>

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
                        onAddComment={() => {
                          commentDom.current?.focus()
                          setIsMoreVisible(false)
                        }}
                        record={demandDetailDrawerProps}
                      />
                    }
                  >
                    <div>
                      <LeftIcontButton icon="more-01" text={t('more')} />
                    </div>
                  </Popover>
                </Tooltip>
              </>
            )}
            {demandDetailDrawerProps.star && (
              <CommonButton
                isStar={drawerInfo.isStar}
                onClick={async () => {
                  const res = await toggleStar(
                    drawerInfo.id,
                    !drawerInfo.isStar,
                  )
                  if (res === 1) {
                    getDemandDetail()
                    dispatch(
                      setTaskDrawerUpdate({
                        id: demandDetailDrawerProps.employeeCurrentId,
                        detailId: drawerInfo.id,
                        state: drawerInfo.isStar ? 2 : 1,
                      }),
                    )
                  }
                }}
                type="icon"
                icon={drawerInfo.isStar ? 'star' : 'star-adipf4l8'}
              />
            )}
          </Space>
        </Header>
        <Content id="contentDom">
          {skeletonLoading && (
            <div style={{ padding: 16 }}>
              <DetailsSkeleton />
            </div>
          )}
          {!skeletonLoading && (
            <div>
              <ParentBox
                style={{
                  backgroundColor: 'white',
                  margin: 0,
                  padding: '12px 24px',
                  borderBottom: '1px solid #EBECED',
                }}
                size={8}
              >
                <div style={{ display: 'flex', backgroundColor: 'white' }}>
                  {drawerInfo.level_tree?.map((i: any, index: number) => (
                    <DrawerHeader
                      style={{
                        cursor:
                          index === drawerInfo?.level_tree?.length - 1
                            ? 'auto'
                            : 'pointer',
                      }}
                      key={i.prefix_key}
                      onClick={() => {
                        // TODO
                        if (demandDetailDrawerProps?.project_id) {
                          projectIdRef.current =
                            demandDetailDrawerProps?.project_id
                        }
                        const projectId = drawerInfo?.projectId
                        if (index !== drawerInfo?.level_tree?.length - 1) {
                          openDemandDetail({ ...i }, projectId, i.id, 0)
                        }
                      }}
                    >
                      <span style={{ display: index === 0 ? 'none' : 'block' }}>
                        <CommonIconFont
                          color="var(--neutral-n1-d1)"
                          type="right"
                        ></CommonIconFont>
                      </span>
                      <img src={i.category_attachment} alt="" />
                      <div
                        className={
                          index === drawerInfo?.level_tree?.length - 1
                            ? ''
                            : myTreeCss
                        }
                        style={{
                          color:
                            index === drawerInfo?.level_tree?.length - 1
                              ? ''
                              : 'var(--neutral-n1-d1)',
                        }}
                      >
                        {i.project_prefix}-{i.prefix_key}
                      </div>
                    </DrawerHeader>
                  ))}
                </div>
                {!skeletonLoading && (
                  <ChangeStatusPopover
                    isCanOperation={
                      isCanEdit &&
                      !drawerInfo.isExamine &&
                      !demandDetailDrawerProps?.isPreview
                    }
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
                <div>
                  <StatusExamine
                    type={1}
                    onCancel={onCancelExamine}
                    isVerify={drawerInfo?.has_verify === 1}
                    isDrawer
                    isPreview={demandDetailDrawerProps?.isPreview}
                  />
                </div>
              )}
              <DemandName
                style={{
                  backgroundColor: 'white',
                  padding: '12px 24px',
                  //
                }}
              >
                {isCanEdit && (
                  <span
                    className="name"
                    ref={spanDom}
                    contentEditable={!demandDetailDrawerProps?.isPreview}
                    onBlur={onNameConfirm}
                  >
                    {drawerInfo.name}
                  </span>
                )}
                {!isCanEdit && <span className="name">{drawerInfo.name}</span>}

                <CopyIcon onCopy={onCopy} />
              </DemandName>
              <ProgressBox
                style={{
                  backgroundColor: 'white',
                  padding: '12px 24px',
                  borderBottom: '1px solid #EBECED',
                }}
              >
                <CommonProgress
                  isTable={false}
                  type="demand"
                  id={drawerInfo.id}
                  percent={drawerInfo?.schedule}
                  hasEdit={
                    isCanEdit &&
                    !demandDetailDrawerProps?.isPreview &&
                    drawerInfo?.user
                      ?.map((i: any) => i?.user?.id)
                      ?.includes(userInfo?.id)
                  }
                  project_id={drawerInfo.projectId}
                  onConfirm={onOperationUpdate}
                />
              </ProgressBox>
              {!demandDetailDrawerProps?.isPreview && (
                <BtnWrap
                  style={{
                    backgroundColor: 'white',
                    margin: 0,
                    padding: '12px 24px',
                  }}
                >
                  <CommonButton
                    type="secondary"
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
                      <CommonButton type="secondary">
                        {t('addTag')}
                      </CommonButton>
                    }
                  />
                  <CommonButton
                    type="secondary"
                    onClick={() => {
                      childrenDemandRef?.current?.onCreateChild()
                    }}
                  >
                    {t('addChildRequirement')}
                  </CommonButton>
                  <CommonButton
                    type="secondary"
                    onClick={() => {
                      storyRelationRef?.current.onClickOpen()
                    }}
                  >
                    {t('linkWorkItem')}
                  </CommonButton>
                </BtnWrap>
              )}
              <DrawerTopInfo
                details={drawerInfo}
                onUpdate={onOperationUpdate}
                isPreview={demandDetailDrawerProps?.isPreview}
              ></DrawerTopInfo>

              <Tabs
                style={{
                  paddingLeft: '24px',
                  paddingTop: '15px',
                  backgroundColor: 'white',
                  // marginBottom: '12px',
                }}
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
                  isPreview={demandDetailDrawerProps?.isPreview}
                />
                <ChildrenDemand
                  onUpdate={onOperationUpdate}
                  detail={drawerInfo}
                  ref={childrenDemandRef}
                  isPreview={demandDetailDrawerProps?.isPreview}
                />
                <StoryRelation
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  isDrawer
                  ref={storyRelationRef}
                  isPreview={demandDetailDrawerProps?.isPreview}
                />
                <BasicDemand
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  isPreview={demandDetailDrawerProps?.isPreview}
                />

                <div
                  id="tab_comment"
                  style={{
                    backgroundColor: 'white',
                    margin: 0,
                    marginBottom: 12,
                    padding: '12px 24px',
                  }}
                  className="info_item_tab"
                >
                  <Label> {t('requirements_review')}</Label>
                  <CommonComment
                    data={demandCommentList}
                    onDeleteConfirm={onDeleteCommentConfirm}
                    onEditComment={onEditComment}
                  />
                </div>
              </LayerBox>
            </div>
          )}
          <DetailFooter style={{ padding: '0 12px' }}>
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
            padding: '24px 0',
            width: '100% ',
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
