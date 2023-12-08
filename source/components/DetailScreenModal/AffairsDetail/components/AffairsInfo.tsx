/* eslint-disable react/jsx-no-useless-fragment */
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
import { getIdsForAt, removeNull } from '@/tools'
import { addAffairsComment } from '@/services/affairs'
import {
  getAffairsCommentList,
  getAffairsInfo,
} from '@store/affairs/affairs.thunk'
import { getMessage } from '@/components/Message'
import LinkSprint from './LinkSprint'
import ActivitySprint from './ActivitySprint'
import AffairsDetail from './AffairsDetail'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import CommonIconFont from '@/components/CommonIconFont'
import ChildSprint from './ChildSprint'
import CommonButton from '@/components/CommonButton'
import SprintTag from '@/components/TagComponent/SprintTag'
import { Tabs } from 'antd'
import { useLocation  } from 'react-router-dom'
interface Props {
  onRef: any
  employeeCurrentId?: number
}

const ButtonGroup = (props: {
  state: boolean
  onClickItem: (el: any) => void
  affairsInfo: any
  isInfoPage: any
}) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { projectInfo } = useSelector(store => store.project)
  const [items, setItems] = useState<Array<{ label: string; key: string }>>([])
  const location  = useLocation ()
  const data = [
    { key: 'sprint-attachment', label: t('attachment') },
    { key: 'sprint-tag', label: t('addTag') },
    { key: 'sprint-childSprint', label: t('sprint.sub') },
    { key: 'sprint-linkSprint', label: t('linkAffairs') },
  ]

  // 更新详情
  const onOperationUpdate = () => {
    dispatch(
      getAffairsInfo({
        projectId: projectInfo.id,
        sprintId: props.affairsInfo.id || 0,
      }),
    )
  }

  useEffect(() => {
    if (props.state) {
      setItems(data.filter(el => el.key !== 'sprint-childSprint'))
    } else {
      setItems(data)
    }
  }, [props.state])
  return (
    <ButtonGroupWrap style={{ paddingBottom: '16px' }}>
      {items.map((el: { label: string; key: string }) => (
        <div key={el.key}>
          <>
            {el.key === 'sprint-tag' && (
              <SprintTag
                defaultList={props.affairsInfo?.tag?.map((i: any) => ({
                  id: i.id,
                  color: i.tag?.color,
                  name: i.tag?.content,
                }))}
                canAdd
                onUpdate={onOperationUpdate}
                detail={props.affairsInfo}
                isDetailQuick
                addWrap={
                  <CommonButton
                    style={{ marginRight: '12px' }}
                    key={el.key}
                    type="secondary"
                  >
                    {el.label}
                  </CommonButton>
                }
              />
            )}

            {el.key !== 'sprint-tag' && (
              <CommonButton
                type="secondary"
                style={{ marginRight: '12px' }}
                onClick={() => props.onClickItem(el)}
              >
                {el.label}
              </CommonButton>
            )}
          </>
        </div>
      ))}
    </ButtonGroupWrap>
  )
}
const AffairsInfo = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const LeftDomDetailInfo = useRef<HTMLDivElement>(null)
  const commentDom: any = createRef()
  const childRef: any = createRef()
  const linkSprint: any = createRef()
  const uploadFile: any = createRef()
  const LeftDomC = LeftDomDetailInfo.current
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfoValues, projectInfo } = useSelector(store => store.project)
  const [tabActive, setTabActive] = useState('sprint-info')
  const [isScroll, setIsScroll] = useState(false)
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
      key: 'sprint-activity',
      label: t('activity'),
    },
  ]
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
    setIsScroll(!(e.target.scrollTop < 60))
    // 滚动容器
    if (!document.querySelector('.sprintDetail_dom')) {
      return
    }
    const { scrollTop } = document.querySelector(
      '.sprintDetail_dom',
    ) as HTMLElement
    // 所有标题节点
    let sprintAttachment: any =
      document.getElementById('sprint-attachment')?.offsetTop
    let sprintTag: any = document.getElementById('sprint-tag')?.offsetTop
    let sprintLinkSprint: any =
      document.getElementById('sprint-linkSprint')?.offsetTop
    let sprintActivity: any =
      document.getElementById('sprint-activity')?.offsetTop
    let sprintChildSprint: any =
      document.getElementById('sprint-childSprint')?.offsetTop
    if (sprintTag + 80 >= Math.floor(scrollTop)) {
      setTabActive('sprint-tag')
    } else if (sprintAttachment + 80 >= Math.floor(scrollTop)) {
      setTabActive('sprint-attachment')
    } else if (sprintChildSprint + 80 >= Math.floor(scrollTop)) {
      setTabActive('sprint-childSprint')
    } else if (sprintLinkSprint + 80 >= Math.floor(scrollTop)) {
      setTabActive('sprint-linkSprint')
    } else if (sprintActivity + 80 >= Math.floor(scrollTop)) {
      setTabActive('sprint-activity')
    }
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

  const aa =
    userPreferenceConfig.previewModel === 3 ||
    (props?.employeeCurrentId || 0) > 0
  const startHeight = aa ? 80 : 100
  const a2 = affairsInfo?.isExamine ? 176 : 110
  const a3 = affairsInfo?.isExamine ? 236 : 165
  // 新加入的人员取消头部
  const a4 = a2 - (props?.employeeCurrentId || 0) > 0 ? 67 : 0
  const a5 = a3 - (props?.employeeCurrentId || 0) > 0 ? 67 : 0
  // 少了64事务出不来评论
  const a1 = aa ? a4 : a5
  console.log(a1)
  return (
    <InfoWrap
      height={`calc(${startHeight}vh - ${
        a1 + (document.getElementById('DetailText')?.clientHeight || location.pathname ==='/EmployeeProfile' ? 75 :100)
      }px)`}
    >
      {/* 子任务不存在子事务模块 */}
      {!isScroll && !props?.employeeCurrentId && (
        <ButtonGroup
          state={affairsInfo.work_type === 6}
          onClickItem={onClickItem}
          affairsInfo={affairsInfo}
          isInfoPage
        />
      )}
      {isScroll && (
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
      )}
      <DetailInfoWrap
        ref={LeftDomDetailInfo}
        className="sprintDetail_dom"
        isScroll={isScroll}
      >
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
          <ActivitySprint />
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
        padding={'no'}
        onConfirm={onConfirmComment}
        style={{ marginLeft: 15, padding: '0', width: 'calc(100% - 36px)' }}
        maxHeight="60vh"
        hasAvatar
      />
    </InfoWrap>
  )
}

export default AffairsInfo
