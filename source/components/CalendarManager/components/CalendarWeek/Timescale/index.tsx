import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CurrentTimeLine from '../../CurrentTimeLine'
import { oneHourHeight } from '../../../config'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
import NewCalendarArea from '../../NewCalendarArea'
import { Dropdown, Popover } from 'antd'
import QuickCreateScheduleModel from '../../QuickCreateScheduleModel'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'

interface TimescaleProps {}
const Table = styled.table`
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
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
    font-weight: 500;
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
  const { calendarData } = useSelector(store => store.calendar)
  const currentColor = useMemo(() => {
    return calendarData.manage.find(item => item.is_default === 1)?.color
  }, [calendarData])
  const [timeZone, setTimeZone] = React.useState<string[]>([])
  const [distance, setDistance] = React.useState(0)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const dispatch = useDispatch()

  const onSelectTimeZone = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      // 点击空白重置
      if (timeZone.length) {
        setTimeZone([])
        dispatch(
          setQuickCreateScheduleModel({
            visible: false,
          }),
        )
        return
      }

      let startY = e.screenY
      let dis = 0
      function onMousemove(event: MouseEvent) {
        const deltaY = event.screenY - startY
        setDistance(deltaY)
      }
      if (tableRef.current === null) {
        return
      }
      const dom = tableRef.current
      function onMouseUp(event: MouseEvent) {
        // setDistance(dis)
        const calenderBoxRightArea = document.querySelector(
          '#calenderBoxRightArea',
        ) as Element
        dom.removeEventListener('mousemove', onMousemove)
        dispatch(
          setQuickCreateScheduleModel({
            visible: true,
            x: event.offsetX,
            y: event.screenY - 630 + calenderBoxRightArea.scrollTop,
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
    [timeZone],
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
                const id = `2023-03-29 ${str}:${15 * index}00`
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
                    {Array(7)
                      .fill(0)
                      .map((_, tdIndex) => {
                        return (
                          <td
                            key={tdIndex}
                            className={classNames('borderRight', {
                              borderTop: index === 0,
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
  }, [currentColor, timeZone])
  return (
    // <Popover trigger={['contextMenu']} content={popoverContent} title="Title">
    <Table ref={tableRef} className="time-scale">
      {content}
      <CurrentTimeLine />
      {/* <NewCalendarArea
        color={currentColor ?? ''}
        timeZone={timeZone}
        distance={distance}
      /> */}
      <QuickCreateScheduleModel />
      <ScheduleInfoDropdown />
    </Table>
    // </Popover>
  )
}

export default Timescale
