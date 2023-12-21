/* eslint-disable react/jsx-no-leaked-render */
import { useDispatch, useSelector } from '@store/index'
import { createRef, useEffect, useRef, useState } from 'react'
import {
  BasicFooter,
  FlawInfoInfoItem,
  FlawInfoLabel,
  FlawInfoLeft,
  FlawInfoWrap,
  SprintDetailDragLine,
  SprintDetailMouseDom,
  WrapRight,
  TabsCount,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { ConfigWrap } from '@/components/StyleCommon'
import {
  detailTimeFormat,
  getIdsForAt,
  getParamsData,
  removeNull,
} from '@/tools'
import { useTranslation } from 'react-i18next'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setActiveCategory } from '@store/category'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import FlawComment from './FlawComment'
import FlawStatus from './FlawStatus'
import FlawBasic from './FlawBasic'
import FlawDetail from './FlawDetail'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { getMessage } from '@/components/Message'
import { addFlawComment } from '@/services/flaw'
import { Tabs } from 'antd'

const FlawInfo = () => {
  const commentDom: any = createRef()
  const [t] = useTranslation()
  const routerPath = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const { flawInfo, flawCommentList } = useSelector(store => store.flaw)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)
  const [tabActive, setTabActive] = useState('tab_desc')
  const [filter, setFilter] = useState(false)
  const [transferRecordsCount, setTransferRecordsCount] = useState(0)
  const { projectInfo, isDetailScreenModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { userPreferenceConfig } = useSelector(store => store.user)
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
      key: 'tab_associatedWorkItems',
      label: t('associatedWorkItems'),
    },
    {
      key: 'tab_info',
      label: t('newlyAdd.basicInfo'),
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

  //   刷新缺陷详情
  const onUpdate = () => {
    dispatch(getFlawInfo({ projectId: projectInfo?.id, id: flawInfo.id }))
  }

  // 跳转配置
  const onToConfig = () => {
    dispatch(setActiveCategory({}))
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo?.id,
        categoryItem: {
          id: flawInfo.category,
          status: flawInfo.category_status,
        },
      }),
    )
    navigate(`/ProjectDetail/Setting/TypeConfiguration?data=${params}`)
  }

  // 提交评论
  const onConfirmComment = async (value: any) => {
    await addFlawComment({
      projectId: projectInfo.id,
      id: flawInfo.id || 0,
      content: value.info,
      attachment: value.attachment,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: t('p2.conSuccess') })
    dispatch(
      getFlawCommentList({
        projectId: projectInfo.id,
        id: flawInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
    commentDom.current.cancel()
  }

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    document.getElementById('contentDom')?.scrollTo({
      top: (dom?.offsetTop ?? 0) - 76,
      behavior: 'smooth',
    })
    setTabActive(value)
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

  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)

      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

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

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [document.getElementById('contentDom')])

  // 计算高度
  const a1 = flawInfo?.isExamine ? 91 : 130
  const a2 = flawInfo?.isExamine ? 164 : 186
  const a3 = 239

  return (
    <FlawInfoWrap
      all={
        userPreferenceConfig.previewModel === 3 ||
        (params?.employeeCurrentId || 0) > 0
      }
      height={
        (params?.employeeCurrentId || 0) > 0
          ? a1
          : userPreferenceConfig.previewModel === 3
          ? a2
          : a3
      }
    >
      <div
        style={{ width: `calc(100% - ${leftWidth}px)`, position: 'relative' }}
      >
        <Tabs
          style={{
            paddingLeft: '24px',
            paddingTop: '15px',
            backgroundColor: 'white',
            // marginBottom: '12px',
          }}
          className="tabs"
          activeKey={tabActive}
          items={tabItems}
          onChange={onChangeTabs}
        />
        <FlawInfoLeft style={{ width: '100%' }} id="contentDom">
          <FlawDetail
            flawInfo={flawInfo as Model.Flaw.FlawInfo}
            isInfoPage
            isPreview={(params?.employeeCurrentId || 0) > 0}
            userId={params?.employeeCurrentId}
          />
          {flawInfo.id && !params?.employeeCurrentId && (
            <div style={{ margin: '16px', background: '#f5f5f7' }}>
              <FlawInfoInfoItem>
                <FlawInfoLabel>{t('new_p1.a3')}</FlawInfoLabel>
                <FlawStatus
                  pid={projectInfo.id}
                  sid={flawInfo.id}
                  visible={visible}
                />
              </FlawInfoInfoItem>
            </div>
          )}
          {flawInfo?.isExamine && (
            <div className="review">
              <CommonIconFont type="review" size={64} />
            </div>
          )}
          <div style={{ margin: '16px', background: '#f5f5f7' }}>
            <FlawInfoInfoItem id="sprint-activity">
              <FlawComment detail={flawInfo} isOpenInfo />
            </FlawInfoInfoItem>
          </div>
        </FlawInfoLeft>
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
      </div>

      <WrapRight
        ref={basicInfoDom}
        style={{ position: 'relative', width: leftWidth }}
      >
        <SprintDetailMouseDom
          active={focus}
          onMouseDown={onDragLine}
          style={{ left: 0 }}
        >
          <SprintDetailDragLine active={focus} className="line" />
        </SprintDetailMouseDom>
        <FlawBasic
          detail={flawInfo}
          onUpdate={onUpdate}
          isInfoPage
          isPreview={(params?.employeeCurrentId || 0) > 0}
        />
        <BasicFooter style={{ width: '94%' }}>
          <div className="textBox">
            <div>
              {t('created')}
              {detailTimeFormat(flawInfo.createdTime as string)}
            </div>
            <span>
              {t('updated')} {detailTimeFormat(flawInfo.update_at as string)}
            </span>
          </div>
          {!params?.employeeCurrentId && (
            <ConfigWrap onClick={onToConfig}>
              <CommonIconFont type="settings" />
              <div>{t('configurationFields')}</div>
            </ConfigWrap>
          )}
        </BasicFooter>
      </WrapRight>
    </FlawInfoWrap>
  )
}

export default FlawInfo
