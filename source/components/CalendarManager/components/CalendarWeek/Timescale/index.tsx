import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useRef } from 'react'
import { formatYYYYMMDD, oneHourHeight } from '../../../config'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
import ScheduleCardList from '../ScheduleCardList'
import NewCalendarArea from '../NewCalendarArea'
import useWeeks from '../hooks/useWeeks'
import { EventBus } from '@/components/CalendarManager/eventBus'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import useCreateTimeRange from '../hooks/useCreateTimeRange'
import useCreateScheduleArea from '@/components/CalendarManager/hooks/useCreateScheduleArea'

interface TimescaleProps {}
const Table = styled.table`
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  tr {
    height: ${oneHourHeight / 4}px;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  td {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    /* border-top: 1px solid transparent; */
    /* border-bottom: 1px solid transparent; */
  }
  .firstTr {
  }
  .firstTd {
    width: 58px;
    position: relative;
  }
  .borderTop {
    border-top: 1px solid var(--neutral-n6-d1) !important;
  }
  .time {
    font-size: 12px;
    font-family: SiYuanMedium;
    color: var(--neutral-n3);
    position: absolute;
    top: -9px;
    left: 16px;
  }
  .borderRight {
    border-right: 1px solid var(--neutral-n6-d1);
  }
`

const Timescale: React.FC<TimescaleProps> = props => {
  const { calendarData, checkedTime } = useSelector(store => store.calendar)

  const currentColor = useMemo(() => {
    return calendarData.manager.find(item => item.is_default === 1)?.color
  }, [calendarData])

  const { tableRef, timeZone, timeRange, onSelectTimeZone } =
    useCreateScheduleArea()

  const { weeks } = useWeeks()

  const content = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx)
        if (str.length === 1) {
          str = '0' + str
        }

        return (
          <>
            {Array(4)
              .fill(0)
              .map((i, index) => {
                return (
                  <tr key={index}>
                    <td className="firstTd borderRight">
                      {index === 0 && idx !== 0 && (
                        <span className="time">{`${str}:00`}</span>
                      )}
                    </td>
                    {Array(7)
                      .fill(0)
                      .map((_, tdIndex) => {
                        const weedDay = weeks[tdIndex]
                        const id = `${dayjs(weedDay).format(
                          formatYYYYMMDD,
                        )} ${str}:${15 * index}:00`
                        return (
                          <td
                            data-id={id}
                            onMouseDown={e => onSelectTimeZone(e, id)}
                            key={tdIndex}
                            className={classNames('borderRight', {
                              borderTop: index === 0 && idx !== 0,
                            })}
                          ></td>
                        )
                      })}
                  </tr>
                )
              })}
          </>
        )
      })
  }, [currentColor, timeZone, checkedTime, weeks])

  return (
    <Table ref={tableRef} className="time-scale">
      {content}
      <NewCalendarArea timeZone={timeZone} timeRange={timeRange} />
      <ScheduleCardList />
    </Table>
  )
}

export default Timescale
