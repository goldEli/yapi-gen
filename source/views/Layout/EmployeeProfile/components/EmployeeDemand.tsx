/* eslint-disable react/jsx-no-leaked-render */
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
import DetailDemand from '@/components/DemandDetailDrawer/DetailDemand'
import ChildrenDemand from '@/components/DemandDetailDrawer/ChildrenDemand'
import StoryRelation from '@/components/DetailScreenModal/DemandDetail/components/StoryRelation'
import BasicDemand from '@/components/DemandDetailDrawer/BasicDemand'
import CommonComment from '@/components/CommonComment'
import { useDispatch, useSelector } from '@store/index'
import {
  deleteComment,
  updateDemandComment,
  addComment,
  getDemandInfo,
} from '@/services/demand'
import { getMessage } from '@/components/Message'
import { getDemandCommentList } from '@store/demand/demand.thunk'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { setDemandCommentList } from '@store/demand'
import {
  getProjectInfoStore,
  getProjectInfoValuesStore,
} from '@store/project/project.thunk'

interface EmployeeDemandProps {
  id: number
  project_id?: number
  user_id: number
}

const EmployeeDemand = (props: EmployeeDemandProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const detailDemandRef = useRef<any>()
  const childrenDemandRef = useRef<any>()
  const storyRelationRef = useRef<any>()
  const commentDom: any = createRef()
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [drawerInfo, setDrawerInfo] = useState<any>({})
  const [tabActive, setTabActive] = useState('tab_desc')
  const { demandCommentList } = useSelector(store => store.demand)
  const { projectInfoValues } = useSelector(store => store.project)

  const items: any[] = [
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

  // 复制标题
  const onCopy = () => {
    copyLink(drawerInfo.name, t('copysuccess'), t('copyfailed'))
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (drawerInfo?.info === value || !value) {
      return
    }
    await updateDemandComment({
      projectId: drawerInfo.projectId,
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
    await deleteComment({ projectId: drawerInfo.projectId, id: commentId })
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

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addComment({
      projectId: drawerInfo.projectId,
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

  // 获取需求详情
  const getDemandDetail = async () => {
    setSkeletonLoading(true)
    const info = await getDemandInfo({
      projectId: props?.project_id,
      id: props?.id,
    })
    setDrawerInfo(info)
    setSkeletonLoading(false)
    if (info.comment_total) {
      // 获取评论列表
      dispatch(
        getDemandCommentList({
          projectId: props?.project_id,
          demandId: info.id,
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
      dispatch(setDemandCommentList({ list: [] }))
      getDemandDetail()
      dispatch(getProjectInfoValuesStore({ projectId: props.project_id }))
      dispatch(getProjectInfoStore({ projectId: props.project_id }))
    }
  }, [props])

  return (
    <div style={{ width: 'calc(100% - 561px)' }}>
      <TaskContentWrap id="contentDom">
        {skeletonLoading && (
          <div style={{ padding: 16 }}>
            <DetailsSkeleton />
          </div>
        )}
        {!skeletonLoading && (
          <div>
            {drawerInfo?.isExamine && (
              <div>
                <StatusExamine
                  type={1}
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
                padding: '12px 24px',
              }}
            >
              <span className="name">{drawerInfo.name}</span>
              <CopyIcon onCopy={onCopy} />
            </DemandName>
            <ProgressBox>
              <CommonProgress
                isTable={false}
                type="demand"
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
              items={items}
              onChange={onChangeTabs}
            />
            <div>
              <DetailDemand
                detail={drawerInfo}
                ref={detailDemandRef}
                isPreview
                userId={props?.user_id}
              />
              <ChildrenDemand
                detail={drawerInfo}
                ref={childrenDemandRef}
                isPreview
              />
              <StoryRelation
                detail={drawerInfo}
                isDrawer
                ref={storyRelationRef}
                isPreview
              />
              <BasicDemand
                detail={drawerInfo}
                onUpdate={() => {
                  //
                }}
                isPreview
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
            </div>
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
          width: 'calc(100% - 116px - 320px - 561px)',
          height: 80,
        }}
        maxHeight="60vh"
        hasAvatar
      />
    </div>
  )
}

export default EmployeeDemand
