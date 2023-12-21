/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, MenuProps, Skeleton, Space, Tabs, Tooltip } from 'antd'
import { ConfigWrap, DragLine, MouseDom } from '../StyleCommon'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useRef, useState } from 'react'
import {
  ChangeIconGroup,
  CommonItemBox,
  Content,
  DemandName,
  DetailFooter,
  DrawerHeader,
  DropdownMenu,
  Header,
  LayerBox,
  ParentBox,
  SkeletonStatus,
  TabsCount,
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
  setDrawerInfo,
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
import { copyLink, detailTimeFormat, getIdsForAt, removeNull } from '@/tools'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import useShareModal from '@/hooks/useShareModal'
import CommentFooter from '../CommonComment/CommentFooter'
import CommonComment from '../CommonComment'
import { useNavigate } from 'react-router-dom'
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
import { toggleStar } from '@/services/employeeProfile'
import { setTaskDrawerUpdate } from '@store/employeeProfile'
import LeftIcontButton from '../LeftIcontButton'
import { Label } from '../DetailScreenModal/FlawDetail/style'
import ChangeRecord from '../DetailScreenModal/FlawDetail/components/ChangeRecord'
import Circulation from '../DetailScreenModal/FlawDetail/components/Circulation'
import ScreenMinHover from '../ScreenMinHover'

const FlawDetailDrawer = () => {
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem, drawerInfo } =
    useSelector(store => store.project)
  const navigate = useNavigate()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const commentDom: any = createRef()
  const { flawDetailDrawer, flawCommentList } = useSelector(store => store.flaw)
  const { visible, params, isPreview } = flawDetailDrawer
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const [focus, setFocus] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const leftWidth = 960
  const spanDom = useRef<HTMLSpanElement>(null)
  const { userInfo } = useSelector(store => store.user)
  const [tabActive, setTabActive] = useState('tab_desc')
  const flawDetailRef = useRef<any>()
  const relationStoriesRef = useRef<any>()
  const [openDemandDetail] = useOpenDemandDetail()
  const projectRef = useRef('')
  const [filter, setFilter] = useState(false)
  const [transferRecordsCount, setTransferRecordsCount] = useState(0)

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
      key: 'changeRecord',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('changeRecord')}</span>
          <TabsCount>{drawerInfo.changeCount}</TabsCount>
        </div>
      ),
    },
    {
      key: 'transferRecords',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('transferRecords')}</span>
          <TabsCount>{transferRecordsCount}</TabsCount>
        </div>
      ),
    },
    {
      key: 'tab_defectComment',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('comment1')}</span>
          <TabsCount>{flawCommentList?.list.length || 0}</TabsCount>
        </div>
      ),
    },
  ]
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/flaw/update',
    )?.length > 0

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId: params.project_id ?? params.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取事务详情
  const getFlawDetail = async (isInit?: any, ids?: any) => {
    const paramsProjectId =
      params.project_id ??
      params.projectId ??
      projectInfo.id ??
      projectRef.current
    if (paramsProjectId) {
      projectRef.current = paramsProjectId
    }
    if (params?.isAllProject || isPreview) {
      getProjectData()
    }
    if (isInit) {
      setSkeletonLoading(true)
    }
    const info = await getFlawInfo({
      projectId: paramsProjectId,
      id: params?.id,
    })
    dispatch(setDrawerInfo(info))
    if (isInit) {
      setSkeletonLoading(false)
    }
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
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
    const url = `ProjectDetail/Defect?data=${params}`
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
        id: projectInfo.id,
        categoryItem: {
          id: drawerInfo.category,
          status: drawerInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params}`)
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
    const url = `/ProjectDetail/Defect?data=${params}`
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

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 76,
      behavior: 'smooth',
    })
    setTabActive(value)
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
    if (visible || params?.id) {
      if (isPreview) {
        dispatch(setProjectInfo({}))
      }
      dispatch(setFlawCommentList({ list: [] }))
      setDemandIds(params?.demandIds || [])
      getFlawDetail(true, params?.demandIds || [])
    }
  }, [flawDetailDrawer])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      setCurrentIndex(0)
      setDemandIds([])
      if (visible) {
        getFlawDetail()
      }
    }
  }, [isUpdateAddWorkItem])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [document.getElementById('contentDom')])

  return (
    <>
      <ShareModal
        url={`${location.origin}/ProjectDetail/Defect?data=${encryptPhp(
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
            {!flawDetailDrawer.star && (
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

                {/* 如果不能操作为真，则不显示操作按钮 */}
                {!flawDetailDrawer.params.notCanOperation && (
                  <>
                    <div>
                      <LeftIcontButton
                        onClick={onShare}
                        icon="share"
                        text={t('share')}
                      />
                    </div>

                    <div>
                      <LeftIcontButton
                        onClick={onToDetail}
                        icon="full-screen"
                        text={t('openDetails')}
                      />
                    </div>

                    <DropdownMenu
                      placement="bottomRight"
                      trigger={['click']}
                      menu={{ items: items }}
                      getPopupContainer={n => n}
                    >
                      <div>
                        <LeftIcontButton icon="more-01" text={t('more')} />
                      </div>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}
            {flawDetailDrawer.star && (
              <Tooltip title={t('starMark')}>
                <CommonButton
                  isStar={drawerInfo.isStar}
                  onClick={async () => {
                    const res = await toggleStar(
                      drawerInfo.id,
                      !drawerInfo.isStar,
                    )
                    if (res === 1) {
                      getFlawDetail()
                      dispatch(
                        setTaskDrawerUpdate({
                          id: flawDetailDrawer.params.employeeCurrentId,
                          detailId: drawerInfo.id,
                          state: drawerInfo.isStar ? 2 : 1,
                        }),
                      )
                    }
                  }}
                  type="icon"
                  icon={drawerInfo.isStar ? 'star' : 'star-adipf4l8'}
                />
              </Tooltip>
            )}
          </Space>
        </Header>
        <Content
          style={{ padding: '0px 0px', backgroundColor: '#f5f5f7' }}
          id="contentDom"
        >
          {skeletonLoading && (
            <div style={{ padding: 16 }}>
              <DetailsSkeleton />
            </div>
          )}
          {!skeletonLoading && (
            <>
              <ParentBox
                style={{
                  backgroundColor: 'white',
                  padding: '16px 24px',
                  margin: 0,
                  borderBottom: '1px solid #EBECED',
                }}
                size={8}
              >
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
                          openDemandDetail(
                            {
                              ...i,
                              ...{
                                projectId,
                                project_id: projectId,
                                notCanOperation: isPreview,
                              },
                            },
                            projectId,
                            i.id,
                            2,
                            isPreview,
                          )
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
                    isCanOperation={
                      isCanEdit && !drawerInfo.isExamine && !isPreview
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
                <div style={{ marginBottom: 16 }}>
                  <StatusExamine
                    type={3}
                    onCancel={onCancelExamine}
                    isVerify={drawerInfo?.has_verify === 1}
                    isDrawer
                    isPreview={isPreview}
                  />
                </div>
              )}
              <DemandName
                style={{
                  backgroundColor: 'white',
                  padding: '16px 24px 8px 24px',
                  margin: 0,
                }}
              >
                {isCanEdit && (
                  <span
                    className="name"
                    ref={spanDom}
                    contentEditable={!isPreview}
                    onBlur={onNameConfirm}
                  >
                    {drawerInfo.name}
                  </span>
                )}
                {!isCanEdit && <span className="name">{drawerInfo.name}</span>}
                <CopyIcon onCopy={onCopy} />
              </DemandName>
              <div style={{ backgroundColor: 'white', padding: '0 24px' }}>
                <CommonProgress
                  isTable={false}
                  type="flaw"
                  id={drawerInfo.id}
                  percent={drawerInfo?.schedule}
                  hasEdit={
                    !!isCanEdit &&
                    !isPreview &&
                    drawerInfo?.user
                      ?.map((i: any) => i?.user?.id)
                      ?.includes(userInfo?.id)
                  }
                  project_id={drawerInfo.projectId}
                  onConfirm={onOperationUpdate}
                />
              </div>
              <DrawerTopInfo
                details={drawerInfo}
                onUpdate={() => {
                  getFlawDetail()
                }}
                isPreview={isPreview}
              ></DrawerTopInfo>
              <Tabs
                style={{
                  paddingLeft: '24px',
                  paddingTop: '15px',
                  backgroundColor: 'white',
                }}
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
                  isPreview={isPreview}
                />
                <CommonItemBox>
                  <RelationStories
                    detail={drawerInfo}
                    onUpdate={onOperationUpdate}
                    isDrawer
                    ref={relationStoriesRef}
                    isPreview={isPreview}
                  />
                </CommonItemBox>
                <CommonItemBox>
                  <FlawBasic
                    detail={drawerInfo}
                    onUpdate={onOperationUpdate}
                    isPreview={isPreview}
                    hasPadding
                  />
                </CommonItemBox>
                <CommonItemBox>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Label id="changeRecord" className="info_item_tab">
                      {t('changeRecord')}
                    </Label>
                    <ScreenMinHover
                      label={t('common.search')}
                      icon="filter"
                      isActive={filter}
                      onClick={() => setFilter(!filter)}
                    />
                  </div>
                  <ChangeRecord filter={filter} detail={drawerInfo} />
                </CommonItemBox>
                <CommonItemBox>
                  <Label id="transferRecords" className="info_item_tab">
                    {t('transferRecords')}
                  </Label>
                  <Circulation
                    onUpdateCount={setTransferRecordsCount}
                    detail={drawerInfo}
                  />
                </CommonItemBox>

                <CommonItemBox id="tab_defectComment" className="info_item_tab">
                  <Label>{t('comment1')}</Label>
                  <CommonComment
                    data={flawCommentList}
                    onDeleteConfirm={onDeleteCommentConfirm}
                    onEditComment={onEditComment}
                  />
                </CommonItemBox>
              </LayerBox>
            </>
          )}
          <DetailFooter style={{ padding: '16px', marginTop: '12px' }}>
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
            padding: '24px 0',
            width: '100%',
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
