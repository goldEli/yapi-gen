import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import CurrentTimeLine from '../CurrentTimeLine'
import {
  formatYYYYMMDD,
  formatYYYYMMDDhhmmss,
  oneHourHeight,
} from '../../../config'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
import NewCalendarArea from '../NewCalendarArea'
import ScheduleCardList from '../ScheduleCardList'
import QuickCreateScheduleModel from '../../QuickCreateScheduleModel'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import { EventBus } from '@/components/CalendarManager/eventBus'
import useCreateTimeRange from '../hooks/useCreateTimeRange'

interface TimescaleProps {}
const Table = styled.table`
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  /* overflow-x: auto; */
  tr {
    height: ${oneHourHeight / 4}px;
    box-sizing: border-box;
    /* all: unset; */
  }
  td {
    box-sizing: border-box;
    /* all: unset; */
  }
  .firstTr {
  }
  .firstTd {
    width: 58px;
    position: relative;
  }
  .borderTop {
    border-top: 1px solid var(--neutral-n6-d1);
  }
  .time {
    font-size: 12px;
    font-family: SiYuanMedium;
    color: var(--neutral-n3);
    position: absolute;
    top: -9px;
    left: 16px;
  }
`

const Timescale: React.FC<TimescaleProps> = props => {
  const { checkedTime } = useSelector(store => store.calendar)

  const [timeZone, setTimeZone] = React.useState<string[]>([])
  const [distance, setDistance] = React.useState(0)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const timeRange = useCreateTimeRange(timeZone?.[0], distance)
  const timeRangeRef = useRef(timeRange)
  const dispatch = useDispatch()

  useEffect(() => {
    timeRangeRef.current = timeRange
  }, [timeRange])

  const cancelCreateSchedule = () => {
    setTimeZone([])
  }

  useEffect(() => {
    EventBus.getInstance().register('cancelCreateSchedule', () => {
      cancelCreateSchedule()
    })
  }, [])

  const onSelectTimeZone = useCallback(
    (e: React.MouseEvent, id: string) => {
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
        dom.removeEventListener('mousemove', onMousemove)
        const target = event.target as HTMLDivElement
        // 打开创建日程弹窗
        dispatch(
          setQuickCreateScheduleModel({
            visible: true,
            x: event.offsetX + 58,
            y: target.offsetTop,
            startTime: timeRangeRef.current.startTime,
            endTime: timeRangeRef.current.endTime,
            isAll: false,
          }),
        )

        dom.removeEventListener('mouseup', onMouseUp)
      }
      dom.removeEventListener('mousemove', onMousemove)
      dom.addEventListener('mousemove', onMousemove)
      dom.removeEventListener('mouseup', onMouseUp)
      dom.addEventListener('mouseup', onMouseUp)

      setTimeZone([id])
    },
    [timeZone, timeRange],
  )

  const content = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx)
        // console.log(str.length)
        if (str.length === 1) {
          str = '0' + str
        }

        return (
          <>
            {Array(4)
              .fill(0)
              .map((i, index) => {
                const id = `${dayjs(checkedTime).format(
                  formatYYYYMMDD,
                )} ${str}:${15 * index}:00`
                return (
                  <tr
                    key={index}
                    data-id={id}
                    onMouseDown={e => onSelectTimeZone(e, id)}
                  >
                    <td className="firstTd">
                      {index === 0 && idx !== 0 && (
                        <span className="time">{`${str}:00`}</span>
                      )}
                    </td>
                    <td
                      className={classNames('bg', {
                        borderTop: index === 0,
                      })}
                    ></td>
                  </tr>
                )
              })}
          </>
        )
      })
  }, [timeZone, checkedTime])
  return (
    <Table ref={tableRef} className="time-scale">
      {content}
      <CurrentTimeLine />
      <NewCalendarArea timeRange={timeRange} />
      <ScheduleCardList />
      {/* <QuickCreateScheduleModel containerClassName=".time-scale" /> */}
    </Table>
  )
}

export default Timescale
