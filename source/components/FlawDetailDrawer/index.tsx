/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import {
  Drawer,
  MenuProps,
  Popover,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
} from 'antd'
import { CloseWrap, ConfigWrap, DragLine, MouseDom } from '../StyleCommon'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useRef, useState } from 'react'
import {
  BackIcon,
  BtnWrap,
  ChangeIconGroup,
  CollapseItem,
  CollapseItemContent,
  CollapseItemTitle,
  CommentTitle,
  Content,
  DemandName,
  DetailFooter,
  DownWrap,
  DrawerHeader,
  DropdownMenu,
  Header,
  LayerBox,
  ParentBox,
  SkeletonStatus,
  UpWrap,
} from './style'
import CommonIconFont from '../CommonIconFont'
import ChangeStatusPopover from '../ChangeStatusPopover'
import StateTag from '../StateTag'
import CommonButton from '../CommonButton'
import DetailsSkeleton from '../DetailsSkeleton'
import {
  addFlawComment,
  deleteFlaw,
  deleteFlawComment,
  getFlawInfo,
  updateFlawComment,
  updateFlawStatus,
  updateFlawTableParams,
} from '@/services/flaw'
import {
  getFlawCommentList,
  saveFlawDetailDrawer,
} from '@store/flaw/flaw.thunk'
import { getProjectInfo } from '@/services/project'
import {
  setAddWorkItemModal,
  setIsUpdateAddWorkItem,
  setProjectInfo,
} from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getMessage } from '../Message'
import {
  setFlawCommentList,
  setFlawDetailDrawer,
  setFlawInfo,
} from '@store/flaw'
import {
  copyLink,
  detailTimeFormat,
  getIdsForAt,
  removeNull,
  getParamsData,
  getProjectIdByUrl,
} from '@/tools'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import useShareModal from '@/hooks/useShareModal'
import CommentFooter from '../CommonComment/CommentFooter'
import CommonComment from '../CommonComment'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setActiveCategory } from '@store/category'
import CopyIcon from '../CopyIcon'
import StatusExamine from '../StatusExamine'
import { cancelVerify } from '@/services/mine'
import FlawDetail from '../DetailScreenModal/FlawDetail/components/FlawDetail'
import RelationStories from '../DetailScreenModal/FlawDetail/components/RelationStories'
import FlawBasic from '../DetailScreenModal/FlawDetail/components/FlawBasic'
import CommonProgress from '../CommonProgress'
import DrawerTopInfo from '../DrawerTopInfo'
import FlawTag from '../TagComponent/FlawTag'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { myTreeCss } from '../DetailScreenModal/DemandDetail'
let timer: NodeJS.Timeout
const FlawDetailDrawer = () => {
  const normalState = {
    detailInfo: {
      isOpen: true,
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
    flawComment: {
      isOpen: false,
      dom: useRef<any>(null),
    },
  }
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const navigate = useNavigate()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const commentDom: any = createRef()
  const { flawDetailDrawer, flawCommentList } = useSelector(store => store.flaw)
  const { visible, params } = flawDetailDrawer
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const [focus, setFocus] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const [showState, setShowState] = useState<any>(normalState)
  const leftWidth = 960
  const spanDom = useRef<HTMLSpanElement>(null)
  const { userInfo } = useSelector(store => store.user)
  const [tabActive, setTabActive] = useState('tab_desc')
  const flawDetailRef = useRef<any>()
  const relationStoriesRef = useRef<any>()
  const [openDemandDetail] = useOpenDemandDetail()
  const projectRef = useRef('')
  const isTabClick = useRef<string>('')

  const tabItems: any = [
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
      key: 'tab_associatedWorkItems',
      label: t('associatedWorkItems'),
    },
    {
      key: 'tab_info',
      label: t('newlyAdd.basicInfo'),
    },

    {
      key: 'tab_defectComment',
      label: t('defectComment'),
    },
  ]
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/flaw/update',
    )?.length > 0

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId: params.project_id ?? params.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取事务详情
  const getFlawDetail = async (id?: any, ids?: any) => {
    const paramsProjectId =
      params.project_id ??
      params.projectId ??
      projectInfo.id ??
      projectRef.current
    if (paramsProjectId) {
      projectRef.current = paramsProjectId
    }
    if (params?.isAllProject) {
      getProjectData()
    }
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getFlawInfo({
      projectId: paramsProjectId,
      id: id ? id : params?.id,
    })
    info.level_tree?.push({
      id: info.id,
      category_id: info.category,
      prefix_key: info.prefixKey || 0,
      project_prefix: info.projectPrefix || '',
      category_attachment: info.category_attachment,
      parent_id: info.parentId || 0,
      name: info.name,
      work_type: 5,
      attachment_id: 0,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))

    const arr = [
      { key: 'relation', count: info.relation_stories },
      { key: 'flawComment', count: info.comment_total },
    ]

    if (info.comment_total) {
      // 获取评论列表
      dispatch(
        getFlawCommentList({
          projectId: paramsProjectId,
          id: info.id,
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

  // 改变模块显示
  const onChangeShowState = (item: any) => {
    const paramsProjectId = params.project_id ?? params.projectId
    const newState = Object.assign({}, showState)
    const resState = {
      isOpen: !newState[item.key].isOpen,
      dom: newState[item.key].dom,
    }
    newState[item.key].dom.current.style.height = resState.isOpen ? 'auto' : 0
    newState[item.key] = resState
    setShowState(newState)
    if (item.key === 'flawComment') {
      // 获取评论列表
      dispatch(
        getFlawCommentList({
          projectId: paramsProjectId,
          id: params.id,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }

  // 跳转详情页面
  const onToDetail = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: drawerInfo.projectId,
        detailId: drawerInfo.id,
        specialType: 2,
        isOpenScreenDetail: true,
        changeIds: demandIds,
      }),
    )
    const url = `ProjectManagement/Defect?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(0))
      dispatch(setFlawInfo({}))
    }, 0)
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = demandIds[currentIndex - 1]
    if (!currentIndex) return
    dispatch(
      saveFlawDetailDrawer({
        visible: visible,
        params: {
          ...params,
          ...{ id: newIndex },
        },
      }),
    )
  }

  // 向下查找需求
  const onDownDemand = () => {
    const newIndex = demandIds[currentIndex + 1]
    if (currentIndex === demandIds?.length - 1) return
    dispatch(
      saveFlawDetailDrawer({
        visible: visible,
        params: {
          ...params,
          ...{ id: newIndex },
        },
      }),
    )
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
      await updateFlawTableParams({
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
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
  }

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 修改状态
  const onChangeStatus = async (value: any) => {
    await updateFlawStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    getFlawDetail()
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
  }

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

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setFlawDetailDrawer({
        visible: false,
        params: {},
      }),
    )
    dispatch(saveFlawDetailDrawer({}))
    setShowState(normalState)
  }

  //   编辑缺陷
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: drawerInfo.id,
          projectId: drawerInfo.projectId,
          type: 2,
          title: t('editorialDefect'),
        },
      }),
    )
  }

  //   跳转配置
  const onToConfig = () => {
    onCancel()
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 4,
        id: projectInfo.id,
        pageIdx: 'DemandDetail',
        categoryItem: {
          id: drawerInfo.category,
          status: drawerInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteFlaw({
      projectId: drawerInfo.projectId || 0,
      id: drawerInfo.id || 0,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onCancel()
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 删除缺陷弹窗
  const onDelete = () => {
    openDelete({
      title: t('deleteConfirmation'),
      text: t('areYouSureToDeleteThisFlaw'),
      onConfirm() {
        onDeleteConfirm()
        return Promise.resolve()
      },
    })
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        return Promise.resolve()
      },
    })
  }

  // 复制需求id
  const onCopyId = () => {
    copyLink(
      `${drawerInfo.projectPrefix}-${drawerInfo.prefixKey}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 复制需求链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: drawerInfo.projectId,
        detailId: drawerInfo.id,
        specialType: 2,
        isOpenScreenDetail: true,
      }),
    )
    const url = `/ProjectManagement/Defect?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${drawerInfo.projectPrefix}-${drawerInfo.prefixKey}】${text}`,
      t('copysuccess'),
      t('copyfailed'),
    )
  }

  // 更多下拉
  const items: MenuProps['items'] = [
    {
      label: <div onClick={onEdit}>{t('common.edit')}</div>,
      key: '0',
    },
    {
      label: <div onClick={onDelete}>{t('common.del')}</div>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onCopyId}>{t('copy_requirement_number')}</div>,
      key: '2',
    },
    {
      label: <div onClick={onCopyLink}>{t('copy_title_link')}</div>,
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onToConfig}>{t('configuration')}</div>,
      key: '4',
    },
  ]

  const onGetMenu = () => {
    if (isEnd) {
      return items.splice(3.4)
    }
    return items
  }

  const getKeyDown = (e: any) => {
    if (storeAll.getState().flaw.flawDetailDrawer.visible) {
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

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addFlawComment({
      projectId: projectInfo.id,
      id: drawerInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('project.replaySuccess') })
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
    commentDom.current.cancel()
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (drawerInfo?.info === value || !value) {
      return
    }
    await updateFlawComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
  }

  // 删除评论确认
  const onDeleteCommentConfirm = async (commentId: number) => {
    const paramsProjectId = params.project_id ?? params.projectId
    await deleteFlawComment({ projectId: paramsProjectId, id: commentId })
    getMessage({ type: 'success', msg: t('common.deleteSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: paramsProjectId,
        id: params.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 操作后更新列表
  const onOperationUpdate = (value?: boolean) => {
    getFlawDetail('', demandIds)
    isTabClick.current = tabActive
    if (!value) {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
  }

  // 取消审核
  const onCancelExamine = async () => {
    await cancelVerify(drawerInfo.verify_data?.id)
    getMessage({ type: 'success', msg: t('other.cancelExamineSuccess') })
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  useEffect(() => {
    if (visible || params?.id) {
      dispatch(setFlawCommentList({ list: [] }))
      setDemandIds(params?.demandIds || [])
      getFlawDetail('', params?.demandIds || [])
    }
  }, [flawDetailDrawer])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      setCurrentIndex(0)
      setDemandIds([])
      if (visible) {
        getFlawDetail()
        if (isTabClick.current) {
          clearTimeout(timer)
          timer = setTimeout(() => {
            onChangeTabs(isTabClick.current)
            isTabClick.current = ''
          }, 3000)
        }
      }
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])
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
    if (isTabClick.current) {
      return
    }
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
      <ShareModal
        url={`${location.origin}/ProjectManagement/Defect?data=${encryptPhp(
          JSON.stringify({
            detailId: drawerInfo?.id,
            id: projectInfo.id,
            specialType: 2,
            isOpenScreenDetail: true,
          }),
        )}`}
        title={
          drawerInfo?.name
            ? `【${drawerInfo?.projectPrefix}-${drawerInfo?.name}-${userInfo?.name}】`
            : ''
        }
      />
      <DeleteConfirmModal />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={visible}
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
            <Tooltip title={t('share')}>
              <div>
                <CommonButton type="icon" icon="share" onClick={onShare} />
              </div>
            </Tooltip>
            <Tooltip title={t('openDetails')}>
              <div>
                <CommonButton
                  type="icon"
                  icon="full-screen"
                  onClick={onToDetail}
                />
              </div>
            </Tooltip>
            <Tooltip title={t('more')}>
              <DropdownMenu
                placement="bottomRight"
                trigger={['click']}
                menu={{ items: onGetMenu() }}
                getPopupContainer={n => n}
              >
                <div>
                  <CommonButton type="icon" icon="more" />
                </div>
              </DropdownMenu>
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
                      style={{
                        cursor:
                          index === drawerInfo?.level_tree?.length - 1
                            ? 'auto'
                            : 'pointer',
                      }}
                      key={i.prefix_key}
                      onClick={() => {
                        const projectId = drawerInfo?.projectId
                        if (index !== drawerInfo?.level_tree?.length - 1) {
                          openDemandDetail({ ...i }, projectId, i.id, 2)
                        }
                      }}
                    >
                      <img src={i.category_attachment} alt="" />
                      <div
                        className={
                          index === drawerInfo?.level_tree?.length - 1
                            ? ''
                            : myTreeCss
                        }
                        style={{
                          fontSize: '12px',
                          color:
                            index === drawerInfo?.level_tree?.length - 1
                              ? ''
                              : 'var(--neutral-n1-d1)',
                        }}
                      >
                        {i.project_prefix}-{i.prefix_key}
                      </div>
                      <span
                        hidden={
                          drawerInfo.level_tree?.length <= 1 ||
                          index === drawerInfo.level_tree?.length - 1
                        }
                      >
                        <CommonIconFont
                          type="right"
                          color="var(--neutral-n1-d1)"
                        ></CommonIconFont>
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
                    type={3}
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
              <div style={{ marginBottom: 20 }}>
                <CommonProgress
                  isTable={false}
                  type="flaw"
                  id={drawerInfo.id}
                  percent={drawerInfo?.schedule}
                  hasEdit={
                    !!isCanEdit &&
                    drawerInfo?.user
                      ?.map((i: any) => i?.user?.id)
                      ?.includes(userInfo?.id)
                  }
                  project_id={drawerInfo.projectId}
                  onConfirm={onOperationUpdate}
                />
              </div>
              <BtnWrap>
                <CommonButton
                  type="light"
                  onClick={() => {
                    flawDetailRef?.current?.handleUpload()
                  }}
                >
                  {t('appendix')}
                </CommonButton>

                <FlawTag
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
                    relationStoriesRef?.current?.onClickOpen()
                  }}
                >
                  {t('linkWorkItem')}
                </CommonButton>
              </BtnWrap>
              <DrawerTopInfo
                details={drawerInfo}
                onUpdate={() => {
                  getFlawDetail()
                }}
              ></DrawerTopInfo>
              <Tabs
                className="tabs"
                activeKey={tabActive}
                items={tabItems}
                onChange={onChangeTabs}
              />
              <LayerBox>
                <FlawDetail
                  flawInfo={drawerInfo}
                  onUpdate={onOperationUpdate}
                  ref={flawDetailRef}
                />
                <RelationStories
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  isDrawer
                  ref={relationStoriesRef}
                />
                <FlawBasic detail={drawerInfo} onUpdate={onOperationUpdate} />
                <div id="tab_defectComment" className="info_item_tab">
                  <CommentTitle>{t('defectComment')}</CommentTitle>
                  <CommonComment
                    data={flawCommentList}
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
                {t('created')}{' '}
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

export default FlawDetailDrawer
