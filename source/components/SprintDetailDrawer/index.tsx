/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable max-lines */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import {
  setAffairsCommentList,
  setAffairsDetailDrawer,
  setAffairsInfo,
} from '@store/affairs'
import {
  Checkbox,
  Drawer,
  MenuProps,
  Skeleton,
  Space,
  Tabs,
  Tooltip,
} from 'antd'
import { DragLine, MouseDom, ConfigWrap } from '../StyleCommon'
import {
  Header,
  ChangeIconGroup,
  Content,
  DemandName,
  SkeletonStatus,
  DropdownMenu,
  DetailFooter,
  TabsCount,
  StatusAndLongWrap,
  Label,
  CommonItemBox,
} from './style'
import CommonIconFont from '../CommonIconFont'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import StateTag from '../StateTag'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useRef, useState } from 'react'
import { getMessage } from '../Message'
import DetailsSkeleton from '../DetailsSkeleton'
import { toggleStar } from '@/services/employeeProfile'
import {
  addAffairsComment,
  deleteAffairs,
  deleteAffairsComment,
  getAffairsInfo,
  updateAffairsComment,
  updateAffairsStatus,
  updateAffairsTableParams,
} from '@/services/affairs'
import { getProjectInfo } from '@/services/project'
import {
  setAddWorkItemModal,
  setDrawerInfo,
  setIsUpdateAddWorkItem,
  setProjectInfo,
} from '@store/project'
import {
  getAffairsCommentList,
  saveAffairsDetailDrawer,
} from '@store/affairs/affairs.thunk'
import { encryptPhp } from '@/tools/cryptoPhp'
import BasicDemand from './component/BasicDemand'
import CommonComment from '../CommonComment'
import useShareModal from '@/hooks/useShareModal'
import {
  copyLink,
  detailTimeFormat,
  getIdsForAt,
  removeNull,
  getIsPermission,
} from '@/tools'
import CommentFooter from '../CommonComment/CommentFooter'
import LongStroyBread from '../LongStroyBread'
import { useNavigate } from 'react-router-dom'
import { setActiveCategory } from '@store/category'
import CopyIcon from '../CopyIcon'
import DeleteConfirm from '../DeleteConfirm'
import StatusExamine from '../StatusExamine'
import { cancelVerify } from '@/services/mine'
import AffairsDetail from '../DetailScreenModal/AffairsDetail/components/AffairsDetail'
import ChildSprint from '../DetailScreenModal/AffairsDetail/components/ChildSprint'
import LinkSprint from '../DetailScreenModal/AffairsDetail/components/LinkSprint'
import DrawerTopInfo from '../DrawerTopInfo'
import CommonProgress from '../CommonProgress'
import { setTaskDrawerUpdate } from '@store/employeeProfile'
import LeftIcontButton from '../LeftIcontButton'
import ScreenMinHover from '../ScreenMinHover'
import ChangeRecord from '../DetailScreenModal/AffairsDetail/components/ChangeRecord'
import Circulation from '../DetailScreenModal/AffairsDetail/components/Circulation'

const SprintDetailDrawer = () => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const leftWidth = 960
  const dispatch = useDispatch()
  const childRef: any = createRef()
  const linkSprint: any = createRef()
  const uploadFile: any = createRef()
  const { open, ShareModal } = useShareModal()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const spanDom = useRef<HTMLSpanElement>(null)
  const commentDom: any = createRef()
  const [focus, setFocus] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  const [filter, setFilter] = useState(false)
  const [transferRecordsCount, setTransferRecordsCount] = useState(0)
  // 锚点初始化选中
  const [tabActive, setTabActive] = useState('sprint-info')
  const { affairsDetailDrawer, affairsCommentList } = useSelector(
    store => store.affairs,
  )
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem, drawerInfo } =
    useSelector(store => store.project)

  const { userInfo } = useSelector(store => store.user)
  const { fullScreen } = useSelector(store => store.kanBan)

  // 快捷按钮列表
  const projectIdRef = useRef('')

  // tab标签栏
  const items: any = [
    {
      key: 'sprint-info',
      label: t('describe'),
    },
    {
      key: 'schedule',
      label: t('scheduleRecord'),
    },

    {
      key: 'sprint-attachment',
      label: t('attachment'),
    },
    {
      key: 'sprint-tag',
      label: t('tag'),
    },
    {
      key: 'sprint-childSprint',
      label: t('subtransaction'),
    },
    {
      key: 'sprint-linkSprint',
      label: t('linkAffairs'),
    },
    {
      key: 'sprint-basicInfo',
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
      key: 'sprint-activity',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('comment1')}</span>
          <TabsCount>{affairsCommentList?.list.length || 0}</TabsCount>
        </div>
      ),
    },
  ]

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/transaction/update',
    )?.length > 0

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/delete',
  )

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

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId:
        affairsDetailDrawer.params.project_id ??
        affairsDetailDrawer.params.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取事务详情
  const getSprintDetail = async (isInit?: any, ids?: any) => {
    const paramsProjectId =
      affairsDetailDrawer.params.project_id ??
      affairsDetailDrawer.params.projectId ??
      projectInfo?.id ??
      projectIdRef.current
    if (paramsProjectId) {
      projectIdRef.current = paramsProjectId
    }
    // 如果是从员工概况过来的或者是我的-所有项目过来，则调用项目信息接口
    if (
      affairsDetailDrawer.params?.isAllProject ||
      affairsDetailDrawer?.isPreview
    ) {
      getProjectData()
    }
    if (isInit) {
      setSkeletonLoading(true)
    }
    const info = await getAffairsInfo({
      projectId: paramsProjectId,
      sprintId: affairsDetailDrawer.params?.id,
    })
    dispatch(setDrawerInfo(info))
    if (isInit) {
      setSkeletonLoading(false)
    }
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
    // 获取评论列表
    dispatch(
      getAffairsCommentList({
        projectId: paramsProjectId,
        sprintId: info.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setAffairsDetailDrawer({
        visible: false,
        params: {},
      }),
    )
    dispatch(saveAffairsDetailDrawer({}))
    setTabActive('sprint-info')
  }

  // 跳转详情页面
  const onToDetail = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: drawerInfo.projectId,
        detailId: drawerInfo.id,
        specialType: 1,
        isOpenScreenDetail: true,
        changeIds: demandIds,
      }),
    )
    const url = `ProjectDetail/Affair?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    setTimeout(() => {
      dispatch(setIsUpdateAddWorkItem(0))
      dispatch(setAffairsInfo({}))
    }, 0)
  }

  // 修改状态
  const onChangeStatus = async (value: any) => {
    await updateAffairsStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    getSprintDetail('', demandIds || [])
    dispatch(
      getAffairsCommentList({
        projectId: projectInfo.id,
        sprintId: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 向上查找需求
  const onUpDemand = () => {
    const newIndex = demandIds[currentIndex - 1]
    if (!currentIndex) return
    dispatch(
      saveAffairsDetailDrawer({
        visible: affairsDetailDrawer.visible,
        params: {
          ...affairsDetailDrawer.params,
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
      saveAffairsDetailDrawer({
        visible: affairsDetailDrawer.visible,
        params: {
          ...affairsDetailDrawer.params,
          ...{ id: newIndex },
        },
      }),
    )
  }

  const getKeyDown = (e: any) => {
    if (storeAll.getState().affairs.affairsDetailDrawer.visible) {
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

  // 删除评论确认
  const onDeleteCommentConfirm = async (commentId: number) => {
    const paramsProjectId =
      affairsDetailDrawer.params.project_id ??
      affairsDetailDrawer.params.projectId
    await deleteAffairsComment({ projectId: paramsProjectId, id: commentId })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    dispatch(
      getAffairsCommentList({
        projectId: paramsProjectId,
        sprintId: affairsDetailDrawer.params.id,
        page: 1,
        pageSize: 999,
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
      await updateAffairsTableParams({
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

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId: drawerInfo.projectId,
      id: drawerInfo.id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onCancel()
    setIsVisible(false)
    // 更新列表
    dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
  }

  // 删除事务弹窗
  const onDelete = () => {
    setIsVisible(true)
    setIsDeleteCheck([4, 5].includes(drawerInfo.work_type))
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        return Promise.resolve()
      },
    })
  }

  // 编辑事务
  const onEdit = () => {
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId: drawerInfo.id,
          projectId: drawerInfo.project_id ?? drawerInfo.projectId,
          type: drawerInfo.work_type,
          title: t('editorialAffairs'),
        },
      }),
    )
  }

  // 跳转配置
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

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addAffairsComment({
      projectId: projectInfo.id,
      sprintId: drawerInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('project.replaySuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: projectInfo.id,
        sprintId: drawerInfo.id,
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
    await updateAffairsComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: projectInfo.id,
        sprintId: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
  }

  // 操作后更新列表
  const onOperationUpdate = async (value?: boolean) => {
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

  // 菜单
  const onGetMenu = () => {
    // 更多下拉
    let items: MenuProps['items'] = [
      {
        label: <div onClick={onEdit}>{t('common.edit')}</div>,
        key: '6',
      },
      {
        label: <div onClick={onDelete}>{t('common.del')}</div>,
        key: '0',
      },

      {
        type: 'divider',
        key: '10',
      },
      {
        label: <div onClick={onToConfig}>{t('configuration')}</div>,
        key: '5',
      },
    ]
    if (hasEdit) {
      items = items.filter((i: any) => i.key !== '6')
    }
    if (hasDel) {
      items = items.filter((i: any) => i.key !== '0')
    }
    // 子任务不存在子事务模块
    return drawerInfo.work_type === 6
      ? items.filter((i: any) => i.key !== '2')
      : items
  }

  // 监听tab切换滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 46,
      behavior: 'smooth',
    })
  }

  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    if (!document.querySelector('#contentDom')) {
      return
    }
    // 滚动容器
    const { scrollTop } = document.querySelector('#contentDom') as HTMLElement
    // 所有标题节点
    const titleItems = document.querySelectorAll('.info_item_tab')
    let arr: any = []
    titleItems.forEach(element => {
      const { offsetTop, id } = element as HTMLElement
      if (offsetTop - 110 <= scrollTop) {
        const keys = [...arr, ...[id]]
        arr = [...new Set(keys)]
      }
    })
    setTabActive(arr[arr.length - 1])
  }

  useEffect(() => {
    if (affairsDetailDrawer.visible || affairsDetailDrawer.params?.id) {
      setTabActive('sprint-info')
      if (affairsDetailDrawer?.isPreview) {
        dispatch(setProjectInfo({}))
      }
      dispatch(setAffairsCommentList({ list: [] }))
      setDemandIds(affairsDetailDrawer.params?.demandIds || [])
      getSprintDetail(true, affairsDetailDrawer.params?.demandIds || [])
    }
  }, [affairsDetailDrawer])

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      setCurrentIndex(0)
      setDemandIds([])
      if (affairsDetailDrawer.visible) {
        getSprintDetail('', [])
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
    document
      .getElementById('contentDom')
      ?.addEventListener('scroll', handleScroll, true)
    return () => {
      document
        .getElementById('contentDom')
        ?.removeEventListener('scroll', handleScroll, false)
    }
  }, [drawerInfo])

  return (
    <>
      <ShareModal
        url={`${location.origin}/ProjectDetail/Affair?data=${encryptPhp(
          JSON.stringify({
            id: projectInfo.id,
            detailId: drawerInfo.id,
            specialType: 1,
            isOpenScreenDetail: true,
          }),
        )}`}
        title={
          drawerInfo?.name
            ? `【${drawerInfo?.projectPrefix}-${drawerInfo?.prefixKey}-${drawerInfo?.name}-${userInfo?.name}】`
            : ''
        }
      />
      <DeleteConfirm
        title={t('deleteConfirmation')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      >
        <div style={{ marginBottom: 9 }}>
          {t('youWillPermanentlyDeleteWhichCannotBeRecoveredAfterPleaseBe', {
            key: `${drawerInfo.projectPrefix}-${drawerInfo.prefixKey}`,
          })}
        </div>
        {drawerInfo.work_type !== 6 && (
          <Checkbox
            disabled={[4, 5].includes(drawerInfo.work_type)}
            checked={isDeleteCheck}
            onChange={e => setIsDeleteCheck(e.target.checked)}
          >
            {t('deleteAllSubtransactionsUnderThisTransactionAtTheSameTime')}
          </Checkbox>
        )}
      </DeleteConfirm>
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={affairsDetailDrawer.visible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
        getContainer={
          fullScreen
            ? () => document.querySelector('.kanBanFullScreenBox') as any
            : false
        }
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
            {!affairsDetailDrawer.star && (
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
                {!affairsDetailDrawer.params.notCanOperation && (
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
                      menu={{
                        items: onGetMenu(),
                      }}
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
            {affairsDetailDrawer.star && (
              <Tooltip title={t('starMark')}>
                <CommonButton
                  isStar={drawerInfo.isStar}
                  onClick={async () => {
                    const res = await toggleStar(
                      drawerInfo.id,
                      !drawerInfo.isStar,
                    )
                    if (res === 1) {
                      getSprintDetail()
                      dispatch(
                        setTaskDrawerUpdate({
                          id: affairsDetailDrawer.params.employeeCurrentId,
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
          style={{ padding: '0px', backgroundColor: '#f5f5f7' }}
          id="contentDom"
        >
          {skeletonLoading && (
            <div style={{ padding: 16 }}>
              <DetailsSkeleton />
            </div>
          )}
          {!skeletonLoading && (
            <>
              <StatusAndLongWrap
                style={{
                  backgroundColor: 'white',
                  padding: '12px 24px',
                  borderBottom: '1px solid #EBECED',
                }}
              >
                <LongStroyBread
                  longStroy={drawerInfo}
                  openDetail={affairsDetailDrawer}
                  layer
                  onClick={() => {
                    onOperationUpdate()
                  }}
                ></LongStroyBread>
                <ChangeStatusPopover
                  isCanOperation={
                    !affairsDetailDrawer.isPreview &&
                    isCanEdit &&
                    !drawerInfo.isExamine
                  }
                  projectId={drawerInfo.projectId}
                  record={drawerInfo}
                  onChangeStatus={onChangeStatus}
                  type={2}
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
              </StatusAndLongWrap>
              {drawerInfo?.isExamine && (
                <div style={{ marginBottom: 0 }}>
                  <StatusExamine
                    type={2}
                    onCancel={onCancelExamine}
                    isVerify={drawerInfo?.has_verify === 1}
                    isDrawer
                    isPreview={affairsDetailDrawer.isPreview}
                  />
                </div>
              )}
              <DemandName
                style={{ backgroundColor: 'white', padding: ' 12px 24px' }}
              >
                <span
                  className="name"
                  ref={spanDom}
                  contentEditable={!affairsDetailDrawer.isPreview}
                  onBlur={onNameConfirm}
                >
                  {drawerInfo.name}
                </span>
                <CopyIcon onCopy={onCopy} />
              </DemandName>
              <div style={{ backgroundColor: 'white', padding: '0px 24px' }}>
                <CommonProgress
                  isTable={false}
                  type="transaction"
                  id={drawerInfo?.id}
                  percent={drawerInfo?.schedule}
                  hasEdit={
                    !affairsDetailDrawer.isPreview &&
                    !hasEdit &&
                    drawerInfo?.user
                      ?.map((i: any) => i?.user?.id)
                      ?.includes(userInfo?.id)
                  }
                  project_id={drawerInfo?.projectId}
                  onConfirm={onOperationUpdate}
                />
              </div>

              {/* 周期、处理人 */}
              <DrawerTopInfo
                details={drawerInfo}
                onUpdate={onOperationUpdate}
                isPreview={affairsDetailDrawer.isPreview}
              />
              <Tabs
                style={{ paddingTop: '25px' }}
                className="tabs"
                activeKey={tabActive}
                items={
                  // 子任务不存在子事务模块
                  drawerInfo.work_type === 6
                    ? items.filter((i: any) => i.key !== 'sprint-childSprint')
                    : items
                }
                onChange={onChangeTabs}
              />
              <AffairsDetail
                onRef={uploadFile}
                affairsInfo={drawerInfo}
                onUpdate={onOperationUpdate}
                isPreview={affairsDetailDrawer.isPreview}
              />
              <div
                style={{
                  backgroundColor: '#f5f5f7',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '0px ',
                }}
              >
                {drawerInfo.work_type !== 6 && (
                  <ChildSprint
                    onRef={childRef}
                    detail={drawerInfo}
                    onUpdate={onOperationUpdate}
                    isPreview={affairsDetailDrawer.isPreview}
                  />
                )}
                <LinkSprint
                  onRef={linkSprint}
                  detail={drawerInfo}
                  isPreview={affairsDetailDrawer.isPreview}
                />
                <BasicDemand
                  detail={drawerInfo}
                  onUpdate={onOperationUpdate}
                  isPreview={affairsDetailDrawer.isPreview}
                />
              </div>
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
              <CommonItemBox>
                <Label id="sprint-activity" className="info_item_tab">
                  {t('comment1')}
                </Label>
                <CommonComment
                  data={affairsCommentList}
                  onDeleteConfirm={onDeleteCommentConfirm}
                  onEditComment={onEditComment}
                />
              </CommonItemBox>
            </>
          )}
          <DetailFooter style={{ padding: '0px 24px', marginTop: '12px' }}>
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

export default SprintDetailDrawer
