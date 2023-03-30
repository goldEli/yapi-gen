import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CurrentTimeLine from '../../CurrentTimeLine'
import { oneHourHeight } from '../../../config'
import { useSelector } from '@store/index'
import classNames from 'classnames'
import NewCalendarArea from '../../NewCalendarArea'
import { Dropdown, Popover } from 'antd'
import QuickCreateScheduleModel from '../../QuickCreateScheduleModel'

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
`

const Timescale: React.FC<TimescaleProps> = props => {
  const { calendarData } = useSelector(store => store.calendar)
  const currentColor = useMemo(() => {
    return calendarData.manage.find(item => item.is_default === 1)?.color
  }, [calendarData])
  const [timeZone, setTimeZone] = React.useState<string[]>([])
  const [distance, setDistance] = React.useState(0)
  const [pointerPosition, setPointerPosition] = React.useState({ x: 0, y: 0 })
  const [visible, setVisible] = React.useState(false)
  const tableRef = React.useRef<HTMLTableElement>(null)

  const onChangeVisible = (bool: boolean) => {
    setVisible(bool)
  }

  const onSelectTimeZone = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      // 点击空白重置
      if (timeZone.length) {
        setTimeZone([])
        onChangeVisible(false)
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
        setPointerPosition({
          x: event.offsetX,
          y: event.screenY - 630 + calenderBoxRightArea.scrollTop,
        })
        onChangeVisible(true)
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
  }, [currentColor, timeZone])
  console.table(pointerPosition)
  return (
    // <Popover trigger={['contextMenu']} content={popoverContent} title="Title">
    <Table ref={tableRef} className="time-scale">
      {content}
      <CurrentTimeLine />
      <NewCalendarArea
        onChangeVisible={onChangeVisible}
        color={currentColor ?? ''}
        timeZone={timeZone}
        distance={distance}
      />
      <QuickCreateScheduleModel
        pointerPosition={pointerPosition}
        visible={visible}
      />
    </Table>
    // </Popover>
  )
}

export default Timescale
