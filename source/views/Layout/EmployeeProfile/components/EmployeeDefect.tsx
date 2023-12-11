import { useState, useEffect, useRef, createRef } from 'react'
import {
  TaskContentWrap,
  DemandName,
  ProgressBox,
  Label,
  DetailFooter,
} from '../style'
import DetailsSkeleton from '@/components/DetailsSkeleton'
import CopyIcon from '@/components/CopyIcon'
import { useTranslation } from 'react-i18next'
import { copyLink, getIdsForAt, detailTimeFormat, removeNull } from '@/tools'
import StatusExamine from '@/components/StatusExamine'
import CommonProgress from '@/components/CommonProgress'
import DrawerTopInfo from '@/components/DrawerTopInfo'
import { Tabs } from 'antd'
import CommonComment from '@/components/CommonComment'
import { useDispatch, useSelector } from '@store/index'
import { getMessage } from '@/components/Message'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import {
  addFlawComment,
  deleteFlawComment,
  getFlawInfo,
  updateFlawComment,
} from '@/services/flaw'
import { getFlawCommentList } from '@store/flaw/flaw.thunk'
import FlawDetail from '@/components/DetailScreenModal/FlawDetail/components/FlawDetail'
import RelationStories from '@/components/DetailScreenModal/FlawDetail/components/RelationStories'
import FlawBasic from '@/components/DetailScreenModal/FlawDetail/components/FlawBasic'
import { setFlawCommentList } from '@store/flaw'
import {
  getProjectInfoStore,
  getProjectInfoValuesStore,
} from '@store/project/project.thunk'
import NoData from '@/components/NoData'

interface EmployeeDefectProps {
  id: number
  project_id?: number
  user_id: number
}

const EmployeeDefect = (props: EmployeeDefectProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const flawDetailRef = useRef<any>()
  const relationStoriesRef = useRef<any>()
  const commentDom: any = createRef()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [tabActive, setTabActive] = useState('tab_desc')
  const { flawCommentList } = useSelector(store => store.flaw)
  const { projectInfoValues } = useSelector(store => store.project)
  const wrap = useRef<any>()
  const [wrapWidth, setWrapWidth] = useState()
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

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addFlawComment({
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      id: drawerInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('project.replaySuccess') })
    dispatch(
      getFlawCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
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
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
        id: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
  }

  // 删除评论确认
  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteFlawComment({
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      id: commentId,
    })
    getMessage({ type: 'success', msg: t('common.deleteSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
        id: drawerInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 86,
      behavior: 'smooth',
    })
    setTabActive(value)
  }

  // 切换任务重置tabs
  const resetTabs = (value: string) => {
    setTabActive(value)
    document.getElementById('contentDom')?.scrollTo({
      top: 0,
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

  // 获取事务详情
  const getFlawDetail = async () => {
    setSkeletonLoading(true)
    const info = await getFlawInfo({
      projectId: props?.project_id || 0,
      id: props?.id,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)

    if (info.comment_total) {
      // 获取评论列表
      dispatch(
        getFlawCommentList({
          projectId: props?.project_id || 0,
          id: info.id,
          page: 1,
          pageSize: 999,
        }),
      )
    }
  }

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [document.getElementById('contentDom')])

  useEffect(() => {
    if (props?.id && props?.project_id) {
      dispatch(setFlawCommentList({ list: [] }))
      getFlawDetail()
      dispatch(getProjectInfoValuesStore({ projectId: props.project_id }))
      dispatch(getProjectInfoStore({ projectId: props.project_id }))
      setTimeout(() => {
        resetTabs('tab_desc')
      }, 100)
    }
  }, [JSON.stringify(props)])
  const observer = useRef(
    new ResizeObserver(e => {
      if (wrap.current) {
        setWrapWidth(wrap.current?.getBoundingClientRect().width)
      }
    }),
  )
  useEffect(() => {
    if (!wrap.current) {
      return
    }
    observer.current.observe(wrap.current)
    return () => {
      observer.current.disconnect()
    }
  }, [])

  return (
    <div style={{ width: 'calc(100% - 468px)' }}>
      {drawerInfo?.deleted_at && (
        <NoData subText={t('theTaskHasBeenDeletedAndDetailsCannotBeViewed')} />
      )}
      {!drawerInfo?.deleted_at && (
        <>
          <TaskContentWrap
            id="contentDom"
            ref={wrap}
            style={{ paddingBottom: 80 }}
          >
            {skeletonLoading && (
              <div style={{ padding: 16 }}>
                <DetailsSkeleton />
              </div>
            )}
            {!skeletonLoading && (
              <div style={{ marginBottom: 16 }}>
                {drawerInfo?.isExamine && (
                  <div>
                    <StatusExamine
                      type={3}
                      onCancel={() => {
                        //
                      }}
                      isVerify={drawerInfo?.has_verify === 1}
                      isDrawer
                      isPreview
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
                  <span className="name">{drawerInfo.name}</span>
                  <CopyIcon onCopy={onCopy} />
                </DemandName>
                <ProgressBox style={{ paddingTop: 0 }}>
                  <CommonProgress
                    isTable={false}
                    type="flaw"
                    id={drawerInfo.id}
                    percent={drawerInfo?.schedule}
                    hasEdit={false}
                    project_id={drawerInfo.projectId}
                  />
                </ProgressBox>
                <DrawerTopInfo
                  details={drawerInfo}
                  isPreview
                  userId={props?.user_id}
                />
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
                <div>
                  <FlawDetail
                    flawInfo={drawerInfo}
                    ref={flawDetailRef}
                    userId={props?.user_id}
                    isPreview
                  />
                  <RelationStories
                    detail={drawerInfo}
                    isDrawer
                    ref={relationStoriesRef}
                    isPreview
                  />
                  <FlawBasic
                    detail={drawerInfo}
                    onUpdate={() => {
                      //
                    }}
                    isPreview
                  />
                  <div
                    id="tab_defectComment"
                    style={{
                      backgroundColor: 'white',
                      padding: '16px 24px',
                      marginTop: '12px',
                    }}
                    className="info_item_tab"
                  >
                    <Label>{t('defectComment')}</Label>
                    <CommonComment
                      data={flawCommentList}
                      onDeleteConfirm={onDeleteCommentConfirm}
                      onEditComment={onEditComment}
                    />
                  </div>
                </div>
              </div>
            )}
            <DetailFooter style={{ padding: '0 12px' }}>
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
            </DetailFooter>
          </TaskContentWrap>
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
              width: wrapWidth + 'px',
              height: 80,
            }}
            maxHeight="60vh"
            hasAvatar
          />
        </>
      )}
    </div>
  )
}

export default EmployeeDefect
