/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { DetailInfoWrap, InfoWrap } from '../style'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import AffairsDetail from '@/views/SprintProjectDetail/components/AffairsDetail'
import ChildSprint from '@/views/SprintProjectDetail/components/ChildSprint'
import LinkSprint from '@/views/SprintProjectDetail/components/LinkSprint'
import ActivitySprint from '@/views/SprintProjectDetail/components/ActivitySprint'
import CommonIconFont from '@/components/CommonIconFont'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getIdsForAt, getProjectIdByUrl, removeNull } from '@/tools'
import { addAffairsComment } from '@/services/affairs'
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { getMessage } from '@/components/Message'

interface Props {
  onRef: any
}

const AffairsInfo = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const LeftDomDetailInfo = useRef<HTMLDivElement>(null)
  const commentDom: any = createRef()
  const LeftDomC = LeftDomDetailInfo.current
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfoValues } = useSelector(store => store.project)
  const [tabActive, setTabActive] = useState('sprint-info')
  const [isScroll, setIsScroll] = useState(false)

  // tab标签栏
  const items: any = [
    {
      key: 'sprint-info',
      label: t('describe'),
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
      key: 'sprint-activity',
      label: t('activity'),
    },
  ]

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addAffairsComment({
      projectId: getProjectIdByUrl(),
      sprintId: affairsInfo.id,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    dispatch(
      getAffairsCommentList({
        projectId: getProjectIdByUrl(),
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 9999,
      }),
    )
    commentDom.current.cancel()
  }

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    dom?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    setIsScroll(!(e.target.scrollTop < 60))
    // 滚动容器
    const { scrollTop } = document.querySelector(
      '.sprintDetail_dom',
    ) as HTMLElement
    // 所有标题节点
    const titleItems = document.querySelectorAll('.info_item_tab')
    let arr: any = []
    titleItems.forEach(element => {
      const { offsetTop, id } = element as HTMLElement
      if (offsetTop <= scrollTop + 120) {
        const keys = [...arr, ...[id]]
        arr = [...new Set(keys)]
      }
    })
    setTabActive(arr[arr.length - 1])
  }

  useImperativeHandle(props.onRef, () => {
    return {
      changeTabs: onChangeTabs,
    }
  })

  useEffect(() => {
    LeftDomC?.addEventListener('scroll', handleScroll, true)
    return () => {
      LeftDomC?.removeEventListener('scroll', handleScroll, false)
    }
  }, [LeftDomC])

  return (
    <InfoWrap>
      {isScroll && (
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
      )}
      <DetailInfoWrap
        ref={LeftDomDetailInfo}
        className="sprintDetail_dom"
        isScroll={isScroll}
      >
        <AffairsDetail
          affairsInfo={affairsInfo as Model.Affairs.AffairsInfo}
          isInfoPage
        />
        {affairsInfo.work_type !== 6 && (
          <ChildSprint detail={affairsInfo as Model.Affairs.AffairsInfo} />
        )}
        <LinkSprint detail={affairsInfo as Model.Affairs.AffairsInfo} />
        <ActivitySprint />
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
        onConfirm={onConfirmComment}
        style={{ padding: '0 0 0 24px', width: 'calc(100% - 24px)' }}
        maxHeight="60vh"
        hasAvatar
      />
    </InfoWrap>
  )
}

export default AffairsInfo
