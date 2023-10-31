/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import KanBanHeader from './components/KanBanHeader'
import { useRef, useState } from 'react'
import KanBanPerson from './components/KanBanPerson'
import {
  PersonBox,
  SideMain,
  ContentWrap,
  HaveChangeICon,
  ChangeIcon,
} from './style'
import { CloseWrap, DragLine, MouseDom } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import KanBanCardGroup from './components/KanBanCardGroup'
import {
  getPerformanceInsightKanBanList,
  getPerformanceInsightKanBanStatistics,
} from '@/services/performanceInsight'
import moment from 'moment'
import NoData from '@/components/NoData'
import KanBanFullScreen from './components/KanBanFullScreen'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  const { hasSideCommonLayoutWidth } = useSelector(state => state.global)
  // 筛选条件
  const [filterParams, setFilterParams] = useState<any>({
    user_ids: [],
    iteration: [{ id: 0, projectId: 0 }],
    // 搜索值
    keyword: '',
    // 创建时间 - 默认近一个与
    time: [
      moment(new Date())
        .startOf('months')
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      moment(new Date()).endOf('days').format('YYYY-MM-DD'),
    ],
    // 任务状态
    status: [],
    // 优先级
    priority: [],
  })
  // 统计数据
  const [statistics, setStatistics] = useState<any>({})
  // 人员数据分页
  const [personPage, setPersonPage] = useState(1)
  // 看板数据
  const [kanBanData, setKanBanData] = useState({
    list: undefined,
    total: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  // 是否已经删除过数据
  const [isDeleteBefore, setIsDeleteBefore] = useState(false)
  // 判断是否可向前
  const [isToBefore, setIsToBefore] = useState(false)
  // 刷新功能
  const [isUpdate, setIsUpdate] = useState(false)
  // 是否打开全屏
  const [isScreenFull, setIsScreenFull] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [leftWidth, setLeftWidth] = useState(280)
  const [endWidth, setEndWidth] = useState(280)
  const main = useRef<any>(null)
  const sideMainPerformance = useRef<any>(null)
  const sliderRefPerformance = useRef<any>(null)
  const maxWidth = 480

  // 计算出对应格式 用户id
  const onComputedUserIds = (arr: any) => {
    if (arr) {
      const resultUsers = arr?.map((i: any) => ({
        project_id: String(i).split('_')[0],
        user_id: String(i).split('_')[1],
      }))
      return resultUsers
    } else {
      return null
    }
  }

  // 获取统计数据
  const getStatistics = async (params: any) => {
    const response = await getPerformanceInsightKanBanStatistics({
      ...params,
      users: onComputedUserIds(params?.user_ids),
    })
    setStatistics(response)
  }

  // 获取人员看板数据 page: 分页， params： 筛选条件 direction：方向1是向前，2是向后,isInit是否需要开启loading
  const getDataList = async (
    page: number,
    params: any,
    direction?: number,
    isInit?: boolean,
  ) => {
    if (isInit || direction) {
      setIsLoading(true)
    }
    const result = JSON.parse(JSON.stringify(params))
    result.page = page
    const response = await getPerformanceInsightKanBanList({
      ...result,
      users: onComputedUserIds(result?.user_ids),
    })

    if (direction) {
      const resultData: any =
        direction === 1
          ? {
              total: response.total,
              list: [...response?.list, ...(kanBanData?.list || [])]?.slice(
                0,
                50,
              ),
            }
          : {
              total: response.total,
              list:
                page >= 6
                  ? [...(kanBanData?.list || [])?.slice(10), ...response?.list]
                  : [...(kanBanData?.list || []), ...response?.list],
            }
      setKanBanData(resultData)
    } else {
      // 初始化直接赋值
      setKanBanData(response)
    }
    if (isInit || direction) {
      setIsLoading(false)
    }
  }

  // 刷新功能
  const onUpdate = () => {
    setIsUpdate(true)
    setFilterParams({
      user_ids: [],
      iteration: [{ id: 0, projectId: 0 }],
      // 搜索值
      keyword: '',
      // 创建时间 - 默认近一个与
      time: [
        moment(new Date())
          .startOf('months')
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
        moment(new Date()).endOf('days').format('YYYY-MM-DD'),
      ],
      // 任务状态
      status: [],
      // 优先级
      priority: [],
    })
    setTimeout(() => {
      setIsUpdate(false)
    }, 300)
  }

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRefPerformance.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(280)
      setFocus(true)
      if (!sideMainPerformance.current) return
      sideMainPerformance.current.style.transition = '0s'
      width = e.clientX - hasSideCommonLayoutWidth - 24
      if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        if (isOpen) {
          setIsOpen(!isOpen)
        }
        setLeftWidth(width < 32 ? 32 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 280) {
        setEndWidth(width)
        setLeftWidth(32)
        setIsOpen(true)
      } else if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        setLeftWidth(width)
      }
      if (!sideMainPerformance.current) return
      sideMainPerformance.current.style.transition = '0.3s'
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  // 点击按钮
  const onChangeSide = (state: string) => {
    setLeftWidth(state === 'open' ? 280 : 32)
    setEndWidth(state === 'open' ? 0 : 32)
    setIsOpen(false)
  }

  // 更新看板数据 - 加载更多
  const onChangeKanBanData = (item: any) => {
    const resultData: any = (kanBanData?.list || [])?.map((i: any) => ({
      ...i,
      stories: item.id === i.id ? item.stories : i.stories,
    }))
    setKanBanData({
      ...kanBanData,
      list: resultData,
    })
  }

  // 初始化、筛选条件更新
  const onChangFilterUpdate = (value: any) => {
    // 更新统计数据
    getStatistics(value)
    // 获取看板数据
    getDataList(1, value, 0, true)
    setPersonPage(1)
    setIsDeleteBefore(false)
    setIsToBefore(false)
  }

  // 向前翻页
  const onBefore = () => {
    // 是否已经删除过数据，是则当前分页减去极限分页，反之正常返回
    const resultPage = isDeleteBefore ? personPage - 1 : personPage - 5
    setPersonPage(resultPage)
    setIsDeleteBefore(true)
    setIsToBefore(resultPage !== 1)
    // 获取看板数据
    getDataList(resultPage, filterParams, 1)
  }

  // 向后翻页
  const onAfter = () => {
    // 是否已经删除过数据，是则当前分页加去极限分页，反之正常递增
    const resultPage = isDeleteBefore ? personPage + 5 : personPage + 1
    setPersonPage(resultPage)
    setIsDeleteBefore(false)
    setIsToBefore(resultPage >= 6)
    // 获取看板数据
    getDataList(resultPage, filterParams, 2)
  }

  return (
    <>
      <KanBanFullScreen
        isVisible={isScreenFull}
        onClose={() => setIsScreenFull(false)}
      >
        <HaveChangeICon style={{ width: '100%', height: '100%' }}>
          {isToBefore && (
            <ChangeIcon style={{ left: 24, zIndex: 502 }} onClick={onBefore}>
              <CommonIconFont type="left" size={24} />
            </ChangeIcon>
          )}
          {kanBanData?.total > 0 && (
            <Spin indicator={<NewLoadingTransition />} spinning={isLoading}>
              <KanBanCardGroup
                filterParams={filterParams}
                kanBanData={kanBanData}
                onChangeKanBanData={onChangeKanBanData}
              />
            </Spin>
          )}
          {kanBanData?.total <= 0 && <NoData />}
          {kanBanData?.total > personPage * 10 && (
            <ChangeIcon style={{ right: 24, zIndex: 502 }} onClick={onAfter}>
              <CommonIconFont type="right" size={24} />
            </ChangeIcon>
          )}
        </HaveChangeICon>
      </KanBanFullScreen>
      <KanBanHeader
        onChangeFilter={value => {
          setFilterParams(value)
        }}
        onUpdate={onUpdate}
        statistics={statistics}
        filterParams={filterParams}
        onChangFilterUpdate={onChangFilterUpdate}
        isUpdate={isUpdate}
        onChangeScreen={() => setIsScreenFull(!isScreenFull)}
      />
      <ContentWrap ref={main}>
        <PersonBox
          isOpen={isOpen}
          ref={sliderRefPerformance}
          style={{
            width: isOpen ? 32 : leftWidth,
            transition: endWidth < 280 ? '0.2s' : 'initial',
            borderRight:
              leftWidth === 32
                ? '1px solid transparent'
                : '1px solid var(--neutral-n6-d1)',
          }}
        >
          <SideMain
            ref={sideMainPerformance}
            style={{ width: leftWidth }}
            isOpen={isOpen}
          >
            <div className="box" style={{ opacity: leftWidth === 32 ? 0 : 1 }}>
              <KanBanPerson
                filterParams={filterParams}
                onClose={() => onChangeSide('close')}
                onChangeFilter={value => {
                  setFilterParams(value)
                }}
                onChangFilterUpdate={onChangFilterUpdate}
                isUpdate={isUpdate}
              />
            </div>
          </SideMain>
          {leftWidth !== 32 && (
            <MouseDom
              active={focus}
              onMouseDown={onDragLine}
              style={{ left: leftWidth - 6 }}
            >
              <DragLine
                active={focus}
                className="line"
                style={{ marginLeft: 4 }}
              />
            </MouseDom>
          )}
          {leftWidth === 32 && (
            <div className="icon" onClick={() => onChangeSide('open')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont size={20} type="indent" />
              </CloseWrap>
            </div>
          )}
        </PersonBox>
        <HaveChangeICon style={{ width: `calc(100% - ${leftWidth}px)` }}>
          {isToBefore && (
            <ChangeIcon style={{ left: 24, zIndex: 1 }} onClick={onBefore}>
              <CommonIconFont type="left" size={24} />
            </ChangeIcon>
          )}
          {kanBanData?.total > 0 && (
            <Spin indicator={<NewLoadingTransition />} spinning={isLoading}>
              <KanBanCardGroup
                filterParams={filterParams}
                kanBanData={kanBanData}
                onChangeKanBanData={onChangeKanBanData}
              />
            </Spin>
          )}
          {kanBanData?.total <= 0 && <NoData />}
          {kanBanData?.total > personPage * 10 && (
            <ChangeIcon style={{ right: 24, zIndex: 1 }} onClick={onAfter}>
              <CommonIconFont type="right" size={24} />
            </ChangeIcon>
          )}
        </HaveChangeICon>
      </ContentWrap>
    </>
  )
}

export default PerformanceInsightKanBan
