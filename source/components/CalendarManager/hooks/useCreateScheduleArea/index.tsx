import React from 'react'
import useCreateTimeRange from '../useCreateTimeRange'
import { EventBus } from '../../eventBus'
import { useDispatch } from '@store/index'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'

const useCreateScheduleArea = () => {
  const [timeZone, setTimeZone] = React.useState<string[]>([])
  const [distance, setDistance] = React.useState(0)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const timeRange = useCreateTimeRange(timeZone?.[0], distance)
  const timeRangeRef = React.useRef(timeRange)
  const dispatch = useDispatch()
  React.useEffect(() => {
    timeRangeRef.current = timeRange
  }, [timeRange])

  const cancelCreateSchedule = () => {
    setTimeZone([])
  }

  React.useEffect(() => {
    EventBus.getInstance().register('cancelCreateSchedule', () => {
      cancelCreateSchedule()
    })
  }, [])

  const onSelectTimeZone = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      console.log('mousedown', id)
      setDistance(0)
      // 点击空白重置
      if (timeZone.length) {
        cancelCreateSchedule()
        dispatch(
          setQuickCreateScheduleModel({
            visible: false,
          }),
        )
        return
      }

      let startY = e.screenY
      function onMousemove(event: MouseEvent) {
        const deltaY = event.screenY - startY
        setDistance(deltaY)
      }
      if (tableRef.current === null) {
        return
      }
      const dom = tableRef.current
      function onMouseUp(event: MouseEvent) {
        const target = event.target as HTMLDivElement
        // 打开创建日程弹窗
        dispatch(
          setQuickCreateScheduleModel({
            visible: true,
            x: target.offsetLeft,
            y: target.offsetTop,
            startTime: timeRangeRef.current.startTime,
            endTime: timeRangeRef.current.endTime,
            isAll: false,
          }),
        )
        dom.removeEventListener('mousemove', onMousemove)
        dom.removeEventListener('mouseup', onMouseUp)
      }
      dom.removeEventListener('mousemove', onMousemove)
      dom.addEventListener('mousemove', onMousemove)
      dom.removeEventListener('mouseup', onMouseUp)
      dom.addEventListener('mouseup', onMouseUp)

      setTimeZone([id])
    },
    [timeZone],
  )

  return {
    tableRef,
    timeZone,
    timeRange,
    onSelectTimeZone,
  }
}

export default useCreateScheduleArea
