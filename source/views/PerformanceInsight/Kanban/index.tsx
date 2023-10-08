/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import KanBanHeader from './components/KanBanHeader'
import { useEffect, useRef, useState } from 'react'
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
import { getPerformanceInsightKanBanList } from '@/services/performanceInsight'
import moment from 'moment'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  const { hasSideCommonLayoutWidth } = useSelector(state => state.global)
  // 筛选条件
  const [filterParams, setFilterParams] = useState<any>({
    user_ids: [],
    iteration: [],
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
  const [leftWidth, setLeftWidth] = useState(256)
  const [endWidth, setEndWidth] = useState(256)
  const main = useRef<any>(null)
  const sideMainPerformance = useRef<any>(null)
  const sliderRefPerformance = useRef<any>(null)
  const maxWidth = 480

  // 获取统计数据
  const getStatistics = async (params: any) => {
    setStatistics({
      planned: 20,
      completed: 12,
      progress: 10,
      overdue: 5,
    })
  }

  // 获取人员看板数据 page: 分页， params： 筛选条件 direction：方向1是向前，2是向后
  const getDataList = async (page: number, params: any, direction?: number) => {
    // setKanBanData({
    //   list: undefined,
    //   total: 0,
    // })
    const result = JSON.parse(JSON.stringify(params))
    result.page = page
    const response = await getPerformanceInsightKanBanList(result)

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
  }

  // 刷新功能
  const onUpdate = () => {
    // 重置
  }

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRefPerformance.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(256)
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
        setLeftWidth(width < 38 ? 38 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 256) {
        setEndWidth(width)
        setLeftWidth(38)
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
    setLeftWidth(state === 'open' ? 256 : 38)
    setEndWidth(state === 'open' ? 0 : 38)
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
    getDataList(1, value)
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

  // 初始化筛选条件更新统计数据和看板数据
  useEffect(() => {
    onChangFilterUpdate(filterParams)
  }, [])

  return (
    <PermissionWrap
      auth="b/company/kanban"
      permission={currentMenu?.children?.map((i: any) => i.permission)}
    >
      <KanBanHeader
        onChangeFilter={value => {
          setFilterParams(value)
        }}
        onUpdate={onUpdate}
        statistics={statistics}
        filterParams={filterParams}
        onChangFilterUpdate={onChangFilterUpdate}
      />
      <ContentWrap ref={main}>
        <PersonBox
          isOpen={isOpen}
          ref={sliderRefPerformance}
          style={{
            width: isOpen ? 38 : leftWidth,
            transition: endWidth < 256 ? '0.2s' : 'initial',
            borderRight:
              leftWidth === 38
                ? '1px solid transparent'
                : '1px solid var(--neutral-n6-d1)',
          }}
        >
          <SideMain
            ref={sideMainPerformance}
            style={{ width: leftWidth }}
            isOpen={isOpen}
          >
            {leftWidth !== 38 && (
              <div className="box">
                <KanBanPerson
                  filterParams={filterParams}
                  onClose={() => onChangeSide('close')}
                  onChangeFilter={value => {
                    setFilterParams(value)
                  }}
                />
              </div>
            )}
          </SideMain>
          {leftWidth !== 38 && (
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
          {leftWidth === 38 && (
            <div className="icon" onClick={() => onChangeSide('open')}>
              <CloseWrap width={32} height={32}>
                <CommonIconFont size={20} type="indent" />
              </CloseWrap>
            </div>
          )}
        </PersonBox>
        <HaveChangeICon style={{ width: `calc(100% - ${leftWidth}px)` }}>
          {isToBefore && (
            <ChangeIcon style={{ left: 24 }} onClick={onBefore}>
              <CommonIconFont type="left" size={24} />
            </ChangeIcon>
          )}
          <KanBanCardGroup
            filterParams={filterParams}
            kanBanData={kanBanData}
            onChangeKanBanData={onChangeKanBanData}
          />
          {kanBanData.total > personPage * 10 && (
            <ChangeIcon style={{ right: 24 }} onClick={onAfter}>
              <CommonIconFont type="right" size={24} />
            </ChangeIcon>
          )}
        </HaveChangeICon>
      </ContentWrap>
    </PermissionWrap>
  )
}

export default PerformanceInsightKanBan
