/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { Drawer, MenuProps, Popover, Skeleton, Space, Tooltip } from 'antd'
import { CloseWrap, DragLine, MouseDom } from '../StyleCommon'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useRef, useState } from 'react'
import {
  BackIcon,
  ChangeIconGroup,
  CollapseItem,
  CollapseItemContent,
  CollapseItemTitle,
  Content,
  DemandName,
  DetailFooter,
  DownWrap,
  DrawerHeader,
  DropdownMenu,
  Header,
  ParentBox,
  SkeletonStatus,
  UpWrap,
} from './style'
import CommonIconFont from '../CommonIconFont'
import ChangeStatusPopover from '../ChangeStatusPopover'
import StateTag from '../StateTag'
import CommonButton from '../CommonButton'
import DetailsSkeleton from '../DetailsSkeleton'
import FlawDetail from '@/views/IterationDefectDetail/components/FlawDetail'
import RelationStories from '@/views/IterationDefectDetail/components/RelationStories'
import BasicFlaw from '@/views/IterationDefectDetail/components/BasicFlaw'
import {
  addFlawComment,
  deleteFlawComment,
  getFlawInfo,
  updateFlawComment,
} from '@/services/flaw'
import {
  getFlawCommentList,
  saveFlawDetailDrawer,
} from '@store/flaw/flaw.thunk'
import { getProjectInfo } from '@/services/project'
import { setProjectInfo } from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getMessage } from '../Message'
import { setFlawDetailDrawer } from '@store/flaw'
import { copyLink, getIdsForAt, removeNull } from '@/tools'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import useShareModal from '@/hooks/useShareModal'
import CommentFooter from '../CommonComment/CommentFooter'
import CommonComment from '../CommonComment'

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
      isOpen: false,
      dom: useRef<any>(null),
    },
    flawComment: {
      isOpen: false,
      dom: useRef<any>(null),
    },
  }
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const commentDom: any = createRef()
  const { flawDetailDrawer, flawCommentList } = useSelector(store => store.flaw)
  const { visible, params } = flawDetailDrawer
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  const { open, ShareModal } = useShareModal()
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
  const [focus, setFocus] = useState(false)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [demandIds, setDemandIds] = useState([])
  const [showState, setShowState] = useState<any>(normalState)
  const leftWidth = 640

  const modeList = [
    { name: t('project.detailInfo'), key: 'detailInfo', content: '' },
    { name: '关联工作项', key: 'relation', content: '' },
    { name: t('newlyAdd.basicInfo'), key: 'basicInfo', content: '' },
    { name: '缺陷评论', key: 'flawComment', content: '' },
  ]

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) =>
        i.identity ===
        (projectInfo.projectType === 1
          ? 'b/story/update'
          : 'b/transaction/update'),
    )?.length > 0

  // 获取项目详情权限
  const getProjectData = async () => {
    const response = await getProjectInfo({
      projectId: params.project_id ?? params.projectId,
    })
    dispatch(setProjectInfo(response))
  }

  // 获取事务详情
  const getFlawDetail = async (id?: any, ids?: any) => {
    const paramsProjectId = params.project_id ?? params.projectId
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
        flawId: drawerInfo.id,
      }),
    )
    const url = `ProjectManagement/DefectDetail?data=${params}`
    window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
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

  // 修改状态
  const onChangeStatus = async (value: any) => {
    //
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
    //
  }

  //   跳转配置
  const onConfig = () => {
    //
  }

  const onDeleteSprintConfirm = () => {
    //
  }

  // 删除缺陷弹窗
  const onDelete = () => {
    openDelete({
      title: '删除确认',
      text: '确认删除该事务？',
      onConfirm() {
        onDeleteSprintConfirm()
        return Promise.resolve()
      },
    })
  }

  // 分享弹窗
  const onShare = () => {
    open({
      onOk: () => {
        // onShareConfirm()
        return Promise.resolve()
      },
    })
  }

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, '复制成功！', '复制失败！')
  }

  // 更多下拉
  const items: MenuProps['items'] = [
    {
      label: <div onClick={onEdit}>编辑</div>,
      key: '0',
    },
    {
      label: <div onClick={onDelete}>删除</div>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '复制编号',
      key: '2',
    },
    {
      label: '复制链接',
      key: '3',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={onConfig}>配置</div>,
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
    getMessage({ type: 'success', msg: '评论成功' })
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
    await updateFlawComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: '编辑成功' })
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
    getMessage({ type: 'success', msg: '删除成功' })
    dispatch(
      getFlawCommentList({
        projectId: paramsProjectId,
        id: params.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  useEffect(() => {
    if (visible || params?.id) {
      setDemandIds(params?.demandIds || [])
      getFlawDetail('', params?.demandIds || [])
      setShowState(normalState)
    }
  }, [flawDetailDrawer])

  useEffect(() => {
    document.addEventListener('keydown', getKeyDown)
    return () => {
      document.removeEventListener('keydown', getKeyDown)
    }
  }, [])

  return (
    <>
      <ShareModal
        copyLink={() => {
          // Todo 待传入分享组件中复制链接方法
        }}
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
            <CommonButton type="icon" icon="share" onClick={onShare} />
            <CommonButton type="icon" icon="full-screen" onClick={onToDetail} />
            <DropdownMenu
              placement="bottomRight"
              trigger={['click']}
              menu={{ items }}
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
                <span className="name">{drawerInfo.name}</span>
                <span className="icon" onClick={onCopy}>
                  <CommonIconFont type="copy" color="var(--neutral-n3)" />
                </span>
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
                      <FlawDetail
                        flawInfo={drawerInfo}
                        onUpdate={() => getFlawDetail('', demandIds)}
                      />
                    )}
                    {i.key === 'relation' && showState[i.key].isOpen && (
                      <RelationStories
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={() => getFlawDetail('', demandIds)}
                        isDrawer
                      />
                    )}
                    {i.key === 'basicInfo' && showState[i.key].isOpen && (
                      <BasicFlaw
                        detail={drawerInfo}
                        isOpen={showState[i.key].isOpen}
                        onUpdate={() => getFlawDetail('', demandIds)}
                      />
                    )}
                    {i.key === 'flawComment' && (
                      <CommonComment
                        data={flawCommentList}
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
              <div>已创建：5天</div>
              <span>更新日期：4分钟前</span>
            </div>
            <Tooltip title="配置字段">
              <CloseWrap width={32} height={32} onClick={onConfig}>
                <CommonIconFont type="settings" />
              </CloseWrap>
            </Tooltip>
          </DetailFooter>
        </Content>
        <CommentFooter
          onRef={commentDom}
          placeholder="发表评论（按M快捷键发表评论）"
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