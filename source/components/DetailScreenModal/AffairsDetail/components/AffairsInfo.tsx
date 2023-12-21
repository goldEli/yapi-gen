/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import { createRef, useEffect, useImperativeHandle, useState } from 'react'
import { DetailInfoWrap, InfoWrap, TabsWrap1, Label, TabsCount } from '../style'
import { useTranslation } from 'react-i18next'
import { getIdsForAt, getParamsData, removeNull } from '@/tools'
import {
  addAffairsComment,
  deleteAffairsComment,
  updateAffairsComment,
} from '@/services/affairs'
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { getMessage } from '@/components/Message'
import LinkSprint from './LinkSprint'
import AffairsDetail from './AffairsDetail'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import CommonIconFont from '@/components/CommonIconFont'
import ChildSprint from './ChildSprint'
import { Tabs } from 'antd'
import { useLocation, useSearchParams } from 'react-router-dom'
import CommonComment from '@/components/CommonComment'
import ChangeRecord from './ChangeRecord'
import Circulation from './Circulation'
import ScreenMinHover from '@/components/ScreenMinHover'
interface Props {
  onRef: any
  employeeCurrentId?: number
}

const AffairsInfo = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const routerPath = useLocation()
  const [searchParams] = useSearchParams()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const commentDom: any = createRef()
  const childRef: any = createRef()
  const linkSprint: any = createRef()
  const uploadFile: any = createRef()
  const { affairsInfo, affairsCommentList } = useSelector(
    store => store.affairs,
  )
  const { projectInfoValues, projectInfo } = useSelector(store => store.project)
  const [tabActive, setTabActive] = useState('sprint-info')
  const [filter, setFilter] = useState(false)
  const [transferRecordsCount, setTransferRecordsCount] = useState(0)

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
      key: 'changeRecord',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('changeRecord')}</span>
          <TabsCount>{affairsInfo.changeCount}</TabsCount>
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

  // 获取评论列表
  const getList = () => {
    dispatch(
      getAffairsCommentList({
        projectId: projectInfo.id,
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 删除评论
  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteAffairsComment({ projectId: projectInfo.id, id: commentId })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    getList()
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (affairsInfo?.info === value || !value) {
      return
    }
    await updateAffairsComment({
      projectId: projectInfo.id,
      id: commentId,
      storyId: affairsInfo.id || 0,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('successfullyModified') })
    getList()
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addAffairsComment({
      projectId: projectInfo.id,
      sprintId: affairsInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: projectInfo.id,
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 9999,
      }),
    )
    commentDom.current.cancel()
  }

  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    const parentElement: any = document.querySelector('#contentDom')
    const infoItemTabs = parentElement?.querySelectorAll('.info_item_tab')
    // 滚动容器
    if (!document.querySelector('#contentDom')) {
      return
    }
    const { scrollTop } = parentElement as HTMLElement
    // 所有标题节点
    const titleItems: any = infoItemTabs
    let arr: any = []
    titleItems.forEach((element: any) => {
      const { offsetTop, id } = element as HTMLElement
      if (offsetTop - 110 <= scrollTop) {
        const keys = [...arr, ...[id]]
        arr = [...new Set(keys)]
      }
    })
    setTabActive(arr[arr.length - 1])
  }

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    setTabActive(value)
    const dom = document.getElementById(value)
    dom?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  useImperativeHandle(props.onRef, () => {
    return {
      changeTabs: onChangeTabs,
    }
  })

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window?.removeEventListener('scroll', handleScroll, false)
    }
  }, [affairsInfo])

  useEffect(() => {
    // 判断从消息跳转到详情定位评论  只有全屏及弹窗会触发
    if (routerPath?.pathname === '/ProjectDetail/Affair' && affairsInfo?.id) {
      const routerParams = getParamsData(searchParams)
      if (routerParams?.anchorPoint) {
        setTimeout(() => {
          const dom = document.getElementById('sprint-activity')
          dom?.scrollIntoView({
            behavior: 'smooth',
          })
        }, 1500)
      }
    }
  }, [routerPath, affairsInfo])

  const aa =
    userPreferenceConfig.previewModel === 3 ||
    (props?.employeeCurrentId || 0) > 0
  // 可视高度
  const startHeight = aa ? 80 : 100
  const a2 = affairsInfo?.isExamine ? 176 : 124
  const a3 = affairsInfo?.isExamine ? 236 : 176
  // 少了64事务出不来评论
  const a1 = aa ? a2 : a3
  const a6 = aa ? a2 - 76 : a3 - 76

  return (
    <InfoWrap
      height={`calc(${startHeight}vh - ${
        ((props?.employeeCurrentId || 0) > 0 ? a6 : a1) +
        (document.getElementById('DetailText')?.clientHeight || 25)
      }px)`}
    >
      <TabsWrap1 style={{ paddingBottom: '0px' }}>
        <Tabs
          className="tabs"
          activeKey={tabActive}
          items={
            // 子任务不存在子事务模块
            affairsInfo.work_type === 6
              ? items.filter((i: any) => i.key !== 'sprint-childSprint')
              : items
          }
          onChange={onChangeTabs}
        />
      </TabsWrap1>

      <DetailInfoWrap id="contentDom">
        <AffairsDetail
          onRef={uploadFile}
          affairsInfo={affairsInfo as Model.Affairs.AffairsInfo}
          isInfoPage
          isPreview={(props?.employeeCurrentId || 0) > 0}
          userId={props?.employeeCurrentId}
        />
        <div
          style={{
            backgroundColor: '#f5f5f7',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '0 16px 16px 16px',
          }}
        >
          {affairsInfo.work_type !== 6 && (
            <ChildSprint
              onRef={childRef}
              detail={affairsInfo as Model.Affairs.AffairsInfo}
              isInfoPage
              isPreview={(props?.employeeCurrentId || 0) > 0}
            />
          )}
          <LinkSprint
            onRef={linkSprint}
            detail={affairsInfo as Model.Affairs.AffairsInfo}
            isInfoPage
            isPreview={(props?.employeeCurrentId || 0) > 0}
          />
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px 24px',
            }}
          >
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
            <ChangeRecord filter={filter} detail={affairsInfo} />
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px 24px',
            }}
          >
            <Label id="transferRecords" className="info_item_tab">
              {t('transferRecords')}
            </Label>
            <Circulation
              onUpdateCount={setTransferRecordsCount}
              detail={affairsInfo}
            />
          </div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '16px 24px',
            }}
          >
            <Label id="sprint-activity" className="info_item_tab">
              {t('comment1')}
            </Label>
            <CommonComment
              data={affairsCommentList}
              onDeleteConfirm={onDeleteCommentConfirm}
              onEditComment={onEditComment}
            />
          </div>
        </div>

        {affairsInfo?.isExamine && (
          <div className="review">
            <CommonIconFont type="review" size={64} />
          </div>
        )}
      </DetailInfoWrap>
      <CommentFooter
        onRef={commentDom}
        placeholder={t('postComment')}
        personList={removeNull(projectInfoValues, 'user_name')?.map(
          (k: any) => ({
            label: k.content,
            id: k.id,
          }),
        )}
        padding="no"
        onConfirm={onConfirmComment}
        style={{ padding: '0 16px', width: '100%' }}
        maxHeight="60vh"
        hasAvatar
        isEmployee={(props?.employeeCurrentId || 0) > 0}
      />
    </InfoWrap>
  )
}

export default AffairsInfo
