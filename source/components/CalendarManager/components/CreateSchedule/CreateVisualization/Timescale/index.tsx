import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { colorMap, formatYYYYMMDD, oneHourHeight } from '../../../../config'
import { useDispatch, useSelector } from '@store/index'
import classNames from 'classnames'
// import NewCalendarArea from '../NewCalendarArea'
import { Dropdown, Popover } from 'antd'
import ScheduleList from '../ScheduleList'
import NewCalendarArea from '../NewCalendarArea'
import CurrentTimeLine from '../CurrentTimeLine'
// import ScheduleInfoDropdown from '../../ScheduleInfoDropdown'
// import ScheduleCardList from '../ScheduleCardList'

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
  const tableRef = React.useRef<HTMLTableElement>(null)

  const onSelectTimeZone = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      // 点击空白重置
      if (timeZone.length) {
        setTimeZone([])
        // dispatch(
        //   setQuickCreateScheduleModel({
        //     visible: false,
        //   }),
        // )
        return
      }

      // let startY = e.screenY
      // let dis = 0
      function onMousemove(event: MouseEvent) {
        // const deltaY = event.screenY - startY
        // setDistance(deltaY)
      }
      if (tableRef.current === null) {
        return
      }
      const dom = tableRef.current
      function onMouseUp(event: MouseEvent) {
        dom.removeEventListener('mousemove', onMousemove)
        const target = event.target as HTMLDivElement
        // 打开创建日程弹窗
        // dispatch(
        //   setQuickCreateScheduleModel({
        //     visible: true,
        //     x: event.offsetX + 58,
        //     y: target.offsetTop,
        //   }),
        // )
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
    // <Popover trigger={['contextMenu']} content={popoverContent} title="Title">
    <Table ref={tableRef} className="create-visual-time-scale">
      {content}
      <CurrentTimeLine />
      <ScheduleList />
      <NewCalendarArea />
      {/* <NewCalendarArea timeZone={timeZone} distance={distance} />
      <ScheduleCardList />
      <QuickCreateScheduleModel />
      <ScheduleInfoDropdown /> */}
    </Table>
    // </Popover>
  )
}

export default Timescale
