/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import KanBanHeader from './components/KanBanHeader'
import { useEffect, useRef, useState } from 'react'
import KanBanPerson from './components/KanBanPerson'
import { PersonBox, SideMain, ContentWrap } from './style'
import { DragLine, MouseDom } from '@/components/StyleCommon'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  const { kanBanData } = useSelector(store => store.performanceInsight)
  // 筛选条件
  const [filterParams, setFilterParams] = useState<any>({})
  // 统计数据
  const [statistics, setStatistics] = useState<any>({})
  // 人员数据分页
  const [personPage, setPersonPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(320)
  const [endWidth, setEndWidth] = useState(320)
  const main = useRef<any>(null)
  const sideMainPerformance = useRef<any>(null)
  const sliderRefPerformance = useRef<any>(null)
  const maxWidth = 480

  // 获取统计数据
  const getStatistics = async () => {
    setStatistics({
      planned: 20,
      completed: 12,
      progress: 10,
      overdue: 5,
    })
  }

  // 获取人员看板数据
  const getDataList = async (page: number) => {}

  // 刷新功能
  const onUpdate = () => {
    // 重置
  }

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRefPerformance.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(320)
      setFocus(true)
      if (!sideMainPerformance.current) return
      sideMainPerformance.current.style.transition = '0s'
      width = e.clientX - 200
      if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        if (isOpen) {
          setIsOpen(!isOpen)
        }
        setLeftWidth(width < 26 ? 26 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 320) {
        setEndWidth(width)
        setLeftWidth(26)
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

  // 四个筛选条件更新统计数据
  useEffect(() => {
    // 更新统计数据
    getStatistics()
  }, [
    filterParams?.keyword,
    filterParams?.time,
    filterParams?.user_ids,
    filterParams?.iteration,
  ])

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
      />
      <ContentWrap ref={main}>
        <PersonBox
          isOpen={isOpen}
          ref={sliderRefPerformance}
          style={{
            width: isOpen ? 26 : leftWidth,
            transition: endWidth < 320 ? '0.2s' : 'initial',
          }}
        >
          <SideMain
            ref={sideMainPerformance}
            style={{ width: leftWidth }}
            isOpen={isOpen}
          >
            <div className="box">
              <KanBanPerson />
            </div>
          </SideMain>
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
        </PersonBox>
      </ContentWrap>
    </PermissionWrap>
  )
}

export default PerformanceInsightKanBan
