import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CurrentTimeLine from '../CurrentTimeLine'
import { formatYYYYMMDD, oneHourHeight } from '../../../config'
import { useSelector } from '@store/index'
import classNames from 'classnames'
import NewCalendarArea from '../NewCalendarArea'
import ScheduleCardList from '../ScheduleCardList'
import useCreateScheduleArea from '@/components/CalendarManager/hooks/useCreateScheduleArea'

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

  const { tableRef, timeZone, timeRange, onSelectTimeZone } =
    useCreateScheduleArea()

  const content = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx)
        // // console.log(str.length)
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
    </Table>
  )
}

export default Timescale
