/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { DetailInfoWrap, InfoWrap, ButtonGroupWrap, TabsWrap1 } from '../style'
import { useTranslation } from 'react-i18next'
import { getIdsForAt, getProjectIdByUrl, removeNull } from '@/tools'
import { addAffairsComment } from '@/services/affairs'
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { getMessage } from '@/components/Message'
import LinkSprint from './LinkSprint'
import ActivitySprint from './ActivitySprint'
import AffairsDetail from './AffairsDetail'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import CommonIconFont from '@/components/CommonIconFont'
import ChildSprint from './ChildSprint'
import CommonButton from '@/components/CommonButton'
import { Tabs } from 'antd'
interface Props {
  onRef: any
}
const ButtonGroup = (props: {
  state: boolean
  onClickItem: (el: any) => void
  affairsInfo: any
  isInfoPage: any
}) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const dId = useRef<any>()
  const [items, setItems] = useState<Array<{ label: string; key: string }>>([])
  const [tagList, setTagList] = useState<any>()
  const data = [
    { key: 'sprint-attachment', label: t('attachment') },
    { key: 'sprint-tag', label: t('addTag') },
    { key: 'sprint-childSprint', label: t('sprint.sub') },
    { key: 'sprint-linkSprint', label: t('linkAffairs') },
  ]
  useEffect(() => {
    if (props.state) {
      setItems(data.filter(el => el.key !== 'sprint-childSprint'))
    } else {
      setItems(data)
    }
  }, [props.state])

  return (
    <ButtonGroupWrap>
      {items.map((el: { label: string; key: string }) => (
        <div key={el.key}>
          <CommonButton
            type="light"
            style={{ marginRight: '12px' }}
            onClick={() => props.onClickItem(el)}
          >
            {el.label}
          </CommonButton>
        </div>
      ))}
    </ButtonGroupWrap>
  )
}
const AffairsInfo = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const LeftDomDetailInfo = useRef<HTMLDivElement>(null)
  const commentDom: any = createRef()
  const childRef: any = createRef()
  const linkSprint: any = createRef()
  const uploadFile: any = createRef()
  const LeftDomC = LeftDomDetailInfo.current
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfoValues } = useSelector(store => store.project)
  const [tabActive, setTabActive] = useState('sprint-info')
  const [isScroll, setIsScroll] = useState(false)
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

  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    setIsScroll(!(e.target.scrollTop < 60))
    // 滚动容器
    const { scrollTop } = document.querySelector(
      '.sprintDetail_dom',
    ) as HTMLElement
    // 所有标题节点
    // const titleItems = document.querySelectorAll('.info_item_tab')
    let sprintInfo = document.getElementById('sprint-info')
    let sprintTag = document.getElementById('sprint-tag')
    let sprintAttachment = document.getElementById('sprint-attachment')
    let sprintLinkSprint = document.getElementById('sprint-linkSprint')
    let sprintActivity = document.getElementById('sprint-activity')
    console.log(sprintInfo?.offsetTop, 'top1')
    console.log(sprintTag?.offsetTop, 'top2')
    console.log(sprintAttachment?.offsetTop, 'top3')
    // let arr: any = []
    // titleItems.forEach(element => {

    //   const { offsetTop, id } = element as HTMLElement
    //   if (offsetTop <= scrollTop + 120) {
    //   console.log(offsetTop,scrollTop+120,id)
    //     const keys = [...arr, ...[id]]
    //     // arr = [...new Set(keys)]
    //     // console.log(id,'id')
    //   }
    // })
  }

  const onClickItem = (el: any) => {
    if (el.key === 'sprint-childSprint') {
      childRef && childRef.current.onCreateChild()
    } else if (el.key === 'sprint-linkSprint') {
      linkSprint.current.onClickOpen()
    } else if (el.key === 'sprint-attachment') {
      uploadFile.current.handleUpload()
    }
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
    LeftDomC?.addEventListener('scroll', handleScroll, true)
    return () => {
      LeftDomC?.removeEventListener('scroll', handleScroll, false)
    }
  }, [LeftDomC])

  return (
    <InfoWrap
      height={`calc(100vh - ${
        (affairsInfo?.isExamine ? 236 : 187) +
        (document.getElementById('DetailText')?.clientHeight || 25)
      }px)`}
    >
      {/* 子任务不存在子事务模块 */}
      {!isScroll && (
        <ButtonGroup
          state={affairsInfo.work_type === 6}
          onClickItem={onClickItem}
          affairsInfo={affairsInfo}
          isInfoPage
        />
      )}
      {isScroll && (
        <TabsWrap1>
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
      )}
      {tabActive}
      <DetailInfoWrap
        ref={LeftDomDetailInfo}
        className="sprintDetail_dom"
        isScroll={isScroll}
      >
        <AffairsDetail
          onRef={uploadFile}
          affairsInfo={affairsInfo as Model.Affairs.AffairsInfo}
          isInfoPage
        />
        {affairsInfo.work_type !== 6 && (
          <ChildSprint
            onRef={childRef}
            detail={affairsInfo as Model.Affairs.AffairsInfo}
            isInfoPage
          />
        )}
        <LinkSprint
          onRef={linkSprint}
          detail={affairsInfo as Model.Affairs.AffairsInfo}
          isInfoPage
        />
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
