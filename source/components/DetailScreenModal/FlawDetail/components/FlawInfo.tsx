/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'
import { TabsCount } from '../style'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import { getMessage } from '@/components/Message'
import { getIdsForAt, getParamsData, removeNull } from '@/tools'
import {
  DetailInfoWrap,
  InfoWrap,
  Label,
  TabsWrap1,
} from '../../AffairsDetail/style'
import { Tabs } from 'antd'
import FlawDetail from './FlawDetail'
import FlawStatus from './FlawStatus'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import CommonIconFont from '@/components/CommonIconFont'
import { CommonItemBox } from '@/components/FlawDetailDrawer/style'
import FlawComment from './FlawComment'
import ChangeRecord from './ChangeRecord'
import Circulation from './Circulation'
import ScreenMinHover from '@/components/ScreenMinHover'
import RelationStories from './RelationStories'
import { addFlawComment } from '@/services/flaw'
import { setIsUpdateAddWorkItem } from '@store/project'

interface Props {
  onRef: any
  employeeCurrentId?: number
}

const FlawInfo = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const routerPath = useLocation()
  const [searchParams] = useSearchParams()
  const commentDom: any = createRef()
  const relationStoriesRef = useRef<any>()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { flawInfo, flawCommentList } = useSelector(store => store.flaw)
  const {
    projectInfoValues,
    projectInfo,
    isDetailScreenModal,
    isUpdateAddWorkItem,
  } = useSelector(store => store.project)
  const [tabActive, setTabActive] = useState('tab_desc')
  const [filter, setFilter] = useState(false)
  const [transferRecordsCount, setTransferRecordsCount] = useState(0)
  const { params, visible } = isDetailScreenModal

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
      key: 'tab_wander',
      label: t('new_p1.a3'),
    },
    {
      key: 'tab_associatedWorkItems',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('associatedWorkItems')}</span>
        </div>
      ),
    },
    {
      key: 'changeRecord',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{t('changeRecord')}</span>
          <TabsCount>{flawInfo.changeCount}</TabsCount>
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
          <TabsCount>{flawCommentList?.list.length || 0}</TabsCount>
        </div>
      ),
    },
  ]

  // 获取评论列表
  const getList = () => {
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: flawInfo.id ?? 0,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addFlawComment({
      projectId: projectInfo.id,
      id: flawInfo.id || 0,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    getList()
    commentDom.current.cancel()
  }

  // 操作后更新列表
  const onOperationUpdate = (value?: boolean) => {
    if (!value) {
      dispatch(setIsUpdateAddWorkItem(isUpdateAddWorkItem + 1))
    }
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

  useImperativeHandle(props?.onRef, () => {
    return {
      changeTabs: onChangeTabs,
    }
  })

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window?.removeEventListener('scroll', handleScroll, false)
    }
  }, [flawInfo])

  useEffect(() => {
    // 判断从消息跳转到详情定位评论  只有全屏及弹窗会触发
    if (routerPath?.pathname === '/ProjectDetail/Defect' && flawInfo?.id) {
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
  }, [routerPath, flawInfo])

  const aa =
    userPreferenceConfig.previewModel === 3 ||
    (props?.employeeCurrentId || 0) > 0
  // 可视高度
  const startHeight = aa ? 80 : 100
  const a2 = flawInfo?.isExamine ? 176 : 124
  const a3 = flawInfo?.isExamine ? 236 : 176
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
          items={tabItems}
          onChange={onChangeTabs}
        />
      </TabsWrap1>
      <DetailInfoWrap id="contentDom">
        <FlawDetail
          flawInfo={flawInfo as Model.Flaw.FlawInfo}
          isInfoPage
          isPreview={(props?.employeeCurrentId || 0) > 0}
          userId={props?.employeeCurrentId}
        />
        <div
          style={{
            backgroundColor: '#f5f5f7',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 16px 16px 16px',
          }}
        >
          {flawInfo.id && !props?.employeeCurrentId && (
            <CommonItemBox>
              <Label id="tab_wander" className="info_item_tab">
                {t('new_p1.a3')}
              </Label>
              <FlawStatus
                pid={projectInfo.id}
                sid={flawInfo.id}
                visible={visible}
              />
            </CommonItemBox>
          )}

          <CommonItemBox>
            <RelationStories
              detail={flawInfo as any}
              onUpdate={onOperationUpdate}
              isDrawer
              ref={relationStoriesRef}
              isPreview={(props?.employeeCurrentId || 0) > 0}
            />
          </CommonItemBox>

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
            <ChangeRecord
              filter={filter}
              isPreview={(props?.employeeCurrentId || 0) > 0}
              detail={flawInfo}
            />
          </CommonItemBox>

          <CommonItemBox>
            <Label id="transferRecords" className="info_item_tab">
              {t('transferRecords')}
            </Label>
            <Circulation
              onUpdateCount={setTransferRecordsCount}
              isPreview={(params?.employeeCurrentId || 0) > 0}
              detail={flawInfo}
            />
          </CommonItemBox>

          <CommonItemBox>
            <FlawComment detail={flawInfo} isOpenInfo />
          </CommonItemBox>
        </div>

        {flawInfo?.isExamine && (
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
        style={{ marginLeft: 15, padding: '0', width: 'calc(100% - 36px)' }}
        maxHeight="60vh"
        hasAvatar
        isEmployee={location.pathname?.includes('/EmployeeProfile')}
      />
    </InfoWrap>
  )
}

export default FlawInfo
