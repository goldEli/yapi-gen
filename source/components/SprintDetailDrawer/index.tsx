import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
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
  Popover,
  Skeleton,
  Space,
  Tooltip,
} from 'antd'
import { CloseWrap, DragLine, MouseDom } from '../StyleCommon'
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
  DropdownMenu,
  DetailFooter,
  TargetWrap,
} from './style'
import CommonIconFont from '../CommonIconFont'
import ChangeStatusPopover from '../ChangeStatusPopover/index'
import StateTag from '../StateTag'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useRef, useState } from 'react'
import { getMessage } from '../Message'
import DetailsSkeleton from '../DetailsSkeleton'
import ChildSprint from '@/views/SprintProjectDetail/components/ChildSprint'
import LinkSprint from '@/views/SprintProjectDetail/components/LinkSprint'
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
  getParamsData,
  getIsPermission,
  getProjectIdByUrl,
} from '@/tools'
import AffairsDetail from '@/views/SprintProjectDetail/components/AffairsDetail'
import CommentFooter from '../CommonComment/CommentFooter'
import LongStroyBread from '../LongStroyBread'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setActiveCategory } from '@store/category'
import CopyIcon from '../CopyIcon'
import DeleteConfirm from '../DeleteConfirm'
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}
  const { id } = paramsData
  const [t] = useTranslation()
  const leftWidth = 640
  const dispatch = useDispatch()
  const { open, ShareModal } = useShareModal()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const spanDom = useRef<HTMLSpanElement>(null)
  const commentDom: any = createRef()
  const [focus, setFocus] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const [showState, setShowState] = useState<any>(normalState)
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)
  const { affairsDetailDrawer, affairsCommentList } = useSelector(
    store => store.affairs,
  )
  const { projectInfo, projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const { userInfo } = useSelector(store => store.user)

  const modeList = [
    { name: t('details'), key: 'detailInfo', content: '' },
    { name: t('subtransaction'), key: 'childSprint', content: '' },
    { name: t('linkAffairs'), key: 'linkSprint', content: '' },
    { name: t('newlyAdd.basicInfo'), key: 'basicInfo', content: '' },
    { name: t('businessReview'), key: 'demandComment', content: '' },
  ]

  const anchorList = [
    { name: t('attachment'), key: 'sprint-attachment', domKey: 'detailInfo' },
    { name: t('addTag'), key: 'sprint-tag', domKey: 'detailInfo' },
    {
      name: t('addChildAffairs'),
      key: 'sprint-childSprint',
      domKey: 'childSprint',
    },
    { name: t('linkAffairs'), key: 'sprint-linkSprint', domKey: 'linkSprint' },
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

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

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
  const getSprintDetail = async (id?: any, ids?: any) => {
    const paramsProjectId =
      affairsDetailDrawer.params.project_id ??
      affairsDetailDrawer.params.projectId
    if (affairsDetailDrawer.params?.isAllProject) {
      getProjectData()
    }
    setDrawerInfo({})
    setSkeletonLoading(true)
    const info = await getAffairsInfo({
      projectId: paramsProjectId,
      sprintId: id ? id : affairsDetailDrawer.params?.id,
    })
    // info.level_tree?.push({
    //   id: info.id,
    //   category_id: info.category,
    //   prefix_key: info.prefixKey || 0,
    //   project_prefix: info.projectPrefix || '',
    //   category_attachment: info.category_attachment,
    //   parent_id: info.parentId || 0,
    //   name: info.name,
    //   work_type: 5,
    //   attachment_id: 0,
    // })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取当前需求的下标， 用作上一下一切换
    setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
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
    setShowState(normalState)
  }

  // 跳转详情页面
  const onToDetail = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: drawerInfo.projectId,
        sprintId: drawerInfo.id,
        newOpen: true,
        changeIds: demandIds,
      }),
    )
    const url = `SprintProjectManagement/SprintProjectDetail?data=${params}`
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

  // 改变模块显示
  const onChangeShowState = (item: any) => {
    const paramsProjectId =
      affairsDetailDrawer.params.project_id ??
      affairsDetailDrawer.params.projectId
    const newState = Object.assign({}, showState)
    const resState = {
      isOpen: !newState[item.key].isOpen,
      dom: newState[item.key].dom,
    }
    newState[item.key].dom.current.style.height = resState.isOpen ? 'auto' : 0
    newState[item.key] = resState
    setShowState(newState)
    if (item.key === 'demandComment') {
      // 获取评论列表
      dispatch(
        getAffairsCommentList({
          projectId: paramsProjectId,
          sprintId: affairsDetailDrawer.params.id,
          page: 1,
          pageSize: 999,
        }),
      )
    }
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

  // 点击锚点跳转
  const onClickAnchorList = (item: {
    key: string
    domKey: string
    name?: string
  }) => {
    const newState = Object.assign({}, showState)
    newState[item.domKey].isOpen = true
    newState[item.domKey].dom.current.style.height = 'auto'
    setShowState(newState)
    setTimeout(() => {
      const dom = document.getElementById(item.key)
      dom?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  }

  // 确认删除
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId: drawerInfo.projectId,
      id: drawerInfo.id,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    onCancel()
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
    //
    dispatch(setActiveCategory({}))
    const params = encryptPhp(
      JSON.stringify({
        type: 'sprint',
        id: id,
        categoryItem: {
          id: drawerInfo.category,
          status: drawerInfo.category_status,
        },
      }),
    )
    navigate(`/SprintProjectManagement/DemandSetting?data=${params}`)
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
  const onOperationUpdate = (value?: boolean) => {
    getSprintDetail('', demandIds)
    if (!value) {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
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
        label: (
          <div
            onClick={() =>
              onClickAnchorList({
                key: 'sprint-attachment',
                domKey: 'detailInfo',
              })
            }
          >
            {t('addAttachments')}
          </div>
        ),
        key: '1',
      },
      {
        label: (
          <div
            onClick={() =>
              onClickAnchorList({
                key: 'sprint-childSprint',
                domKey: 'childSprint',
              })
            }
          >
            {t('addChildAffairs')}
          </div>
        ),
        key: '2',
      },
      {
        label: (
          <div
            onClick={() =>
              onClickAnchorList({
                key: 'sprint-tag',
                domKey: 'detailInfo',
              })
            }
          >
            {t('addTag')}
          </div>
        ),
        key: '3',
      },
      {
        label: (
          <div
            onClick={() =>
              onClickAnchorList({
                key: 'sprint-linkSprint',
                domKey: 'linkSprint',
              })
            }
          >
            {t('linkAffairs')}
          </div>
        ),
        key: '4',
      },
      {
        type: 'divider',
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
    if (isEnd) {
      items = items.filter((i: any) => !['6', '0', '10'].includes(i.key))
    }
    // 子任务不存在子事务模块
    return drawerInfo.work_type === 6
      ? items.filter((i: any) => i.key !== '2')
      : items
  }

  useEffect(() => {
    if (affairsDetailDrawer.visible || affairsDetailDrawer.params?.id) {
      dispatch(setAffairsCommentList({ list: [] }))
      setDemandIds(affairsDetailDrawer.params?.demandIds || [])
      getSprintDetail('', affairsDetailDrawer.params?.demandIds || [])
      setShowState(normalState)
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

  return (
    <>
      <ShareModal
        url={`${
          location.origin
        }/SprintProjectManagement/SprintProjectDetail?data=${encryptPhp(
          JSON.stringify({
            ...paramsData,
            sprintId: drawerInfo?.id,
            id: getProjectIdByUrl(),
            newOpen: true,
          }),
        )}`}
        title={
          drawerInfo?.name
            ? `【${drawerInfo?.projectPrefix}-${drawerInfo?.name}-${userInfo?.name}】`
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
            <CommonButton type="icon" icon="share" onClick={onShare} />
            <CommonButton type="icon" icon="full-screen" onClick={onToDetail} />
            <DropdownMenu
              placement="bottomRight"
              trigger={['click']}
              menu={{
                items: onGetMenu(),
              }}
              getPopupContainer={n => n}
            >
              <div>
                <CommonButton type="icon" icon="more" />
              </div>
            </DropdownMenu>
          </Space>
        </Header>
        <Content>
          {skeletonLoading && <DetailsSkeleton />}
          {!skeletonLoading && (
            <>
              <LongStroyBread
                longStroy={drawerInfo}
                layer
                onClick={() => {
                  onOperationUpdate()
                }}
              ></LongStroyBread>
              <DemandName style={{ marginTop: 16 }}>
                <span
                  className="name"
                  ref={spanDom}
                  contentEditable
                  onBlur={onNameConfirm}
                >
                  {drawerInfo.name}
                </span>
                <CopyIcon onCopy={onCopy} />
              </DemandName>
              <Space size={8} style={{ marginTop: 16 }}>
                {(drawerInfo.work_type === 6
                  ? anchorList.filter((i: any) => i.domKey !== 'childSprint')
                  : anchorList
                ).map((i: { key: string; domKey: string; name: string }) => (
                  <CommonButton
                    key={i.key}
                    type="light"
                    onClick={() => onClickAnchorList(i)}
                  >
                    {i.name}
                  </CommonButton>
                ))}
              </Space>
              {/* 只有标准事务类型和故障事务类型才有 */}
              {[4, 5].includes(drawerInfo.work_type) && (
                <TargetWrap>
                  <span className="icon">
                    <CommonIconFont
                      type="target"
                      size={16}
                      color="var(--function-warning)"
                    />
                  </span>
                  <span>
                    <span className="label">{t('targetInfo')}</span>
                    {drawerInfo?.iterate_info || '--'}
                  </span>
                </TargetWrap>
              )}
              {(drawerInfo.work_type === 6
                ? modeList.filter((i: any) => i.key !== 'childSprint')
                : modeList
              ).map((i: any) => (
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
                      <AffairsDetail
                        affairsInfo={drawerInfo}
                        onUpdate={onOperationUpdate}
                      />
                    )}
                    {i.key === 'childSprint' && showState[i.key].isOpen && (
                      <ChildSprint detail={drawerInfo} />
                    )}
                    {i.key === 'linkSprint' && (
                      <LinkSprint detail={drawerInfo} />
                    )}
                    {i.key === 'basicInfo' && showState[i.key].isOpen && (
                      <BasicDemand
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={onOperationUpdate}
                      />
                    )}
                    {i.key === 'demandComment' && (
                      <CommonComment
                        data={affairsCommentList}
                        onDeleteConfirm={onDeleteCommentConfirm}
                        onEditComment={onEditComment}
                      />
                    )}
                  </CollapseItemContent>
                </CollapseItem>
              ))}
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
            <Tooltip title={t('configurationFields')}>
              <CloseWrap width={32} height={32} onClick={onToConfig}>
                <CommonIconFont type="settings" />
              </CloseWrap>
            </Tooltip>
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

export default SprintDetailDrawer
