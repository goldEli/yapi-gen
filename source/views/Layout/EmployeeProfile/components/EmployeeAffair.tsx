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
  addAffairsComment,
  deleteAffairsComment,
  getAffairsInfo,
  updateAffairsComment,
} from '@/services/affairs'
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { setAffairsCommentList } from '@store/affairs'
import AffairsDetail from '@/components/DetailScreenModal/AffairsDetail/components/AffairsDetail'
import ChildSprint from '@/components/DetailScreenModal/AffairsDetail/components/ChildSprint'
import LinkSprint from '@/components/DetailScreenModal/AffairsDetail/components/LinkSprint'
import {
  getProjectInfoStore,
  getProjectInfoValuesStore,
} from '@store/project/project.thunk'
import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'

interface EmployeeAffairProps {
  id: number
  project_id?: number
  user_id: number
}

const EmployeeAffair = (props: EmployeeAffairProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const commentDom: any = createRef()
  const childRef: any = createRef()
  const linkSprint: any = createRef()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [tabActive, setTabActive] = useState('sprint-info')
  const { affairsCommentList } = useSelector(store => store.affairs)
  const { projectInfoValues } = useSelector(store => store.project)
  const wrap = useRef<any>()
  const [wrapWidth, setWrapWidth] = useState()

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
      key: 'sprint-comment',
      label: t('businessReview'),
    },
  ]

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addAffairsComment({
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      sprintId: drawerInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('project.replaySuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
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
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      id: commentId,
      storyId: drawerInfo.id,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
        sprintId: drawerInfo.id,
        page: 1,
        pageSize: 9999,
      }),
    )
  }

  // 删除评论确认
  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteAffairsComment({
      projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
      id: commentId,
    })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    dispatch(
      getAffairsCommentList({
        projectId: drawerInfo?.projectId ?? drawerInfo?.project_id,
        sprintId: drawerInfo.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 监听tab切换滚动
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
    // 滚动容器
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
  const getSprintDetail = async () => {
    setSkeletonLoading(true)
    const info = await getAffairsInfo({
      projectId: props?.project_id || 0,
      sprintId: props?.id,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    // 获取评论列表
    dispatch(
      getAffairsCommentList({
        projectId: props?.project_id || 0,
        sprintId: info.id,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  useEffect(() => {
    document
      .getElementById('contentDom')
      ?.addEventListener('scroll', handleScroll, true)
    return () => {
      document
        .getElementById('contentDom')
        ?.removeEventListener('scroll', handleScroll, false)
    }
  }, [document.getElementById('contentDom')])

  useEffect(() => {
    if (props?.id && props?.project_id) {
      dispatch(setAffairsCommentList({ list: [] }))
      getSprintDetail()
      dispatch(getProjectInfoValuesStore({ projectId: props.project_id }))
      dispatch(getProjectInfoStore({ projectId: props.project_id }))
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
      <TaskContentWrap id="contentDom" ref={wrap}>
        {skeletonLoading ? (
          <div style={{ padding: 16 }}>
            <DetailsSkeleton />
          </div>
        ) : null}
        {!skeletonLoading && (
          <div style={{ marginBottom: 4 }}>
            {drawerInfo?.isExamine ? (
              <div>
                <StatusExamine
                  type={2}
                  onCancel={() => {
                    //
                  }}
                  isVerify={drawerInfo?.has_verify === 1}
                  isDrawer
                  isPreview
                />
              </div>
            ) : null}
            <DemandName
              style={{
                backgroundColor: 'white',
                padding: '12px 24px',
              }}
            >
              <span className="name">{drawerInfo.name}</span>
              <CopyIcon onCopy={onCopy} />
            </DemandName>
            <ProgressBox>
              <CommonProgress
                isTable={false}
                type="transaction"
                id={drawerInfo.id}
                percent={drawerInfo?.schedule}
                hasEdit={false}
                project_id={drawerInfo.projectId}
              />
            </ProgressBox>
            <div className="employeeProfileWrap">
              <DrawerTopInfo
                details={drawerInfo}
                isPreview
                userId={props?.user_id}
              />
            </div>
            <Tabs
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
            <AffairsDetail affairsInfo={drawerInfo} isPreview />
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
                <ChildSprint onRef={childRef} detail={drawerInfo} isPreview />
              )}
              <LinkSprint onRef={linkSprint} detail={drawerInfo} isPreview />
              <BasicDemand
                detail={drawerInfo}
                onUpdate={() => {
                  //
                }}
                isPreview
              />
            </div>
            <div
              style={{
                backgroundColor: 'rgb(245, 245, 247)',
                height: 12,
              }}
            />
            <div
              style={{
                backgroundColor: 'white',
                padding: '16px 24px',
              }}
            >
              <Label
                id="sprint-comment"
                className="info_item_tab"
                style={{ marginTop: 16 }}
              >
                {t('businessReview')}
              </Label>
              <CommonComment
                data={affairsCommentList}
                onDeleteConfirm={onDeleteCommentConfirm}
                onEditComment={onEditComment}
              />
            </div>
          </div>
        )}
        <DetailFooter style={{ padding: '0px 24px', marginTop: '12px' }}>
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
          padding: '24px 0px',
          width: wrapWidth + 'px',
          height: 80,
        }}
        maxHeight="60vh"
        hasAvatar
      />
    </div>
  )
}

export default EmployeeAffair
