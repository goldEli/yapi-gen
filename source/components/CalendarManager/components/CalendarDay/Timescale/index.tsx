import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CurrentTimeLine from '../../CurrentTimeLine'
import { oneHourHeight } from '../../../config'
import { useSelector } from '@store/index'
import classNames from 'classnames'
import NewCalendarArea from '../../NewCalendarArea'

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
const Tr = styled.tr`
  .bg {
    background: ${(props: { bg?: string }) => {
      return props.bg
    }};
  }
`

const NewCalendar = styled.div`
  width: calc(100% - 58px);
  /* background: ${(props: { bg?: string }) => {
    return props.bg
  }}; */
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n1-d1);
  position: relative;
  top: 0px;
  left: 58px;
`

const Timescale: React.FC<TimescaleProps> = props => {
  const { list } = useSelector(store => store.calendar)
  const currentColor = useMemo(() => {
    return list.find(item => item.is_default === 1)?.color
  }, [list])
  const [timeZone, setTimeZone] = React.useState<string[]>([])
  const [distance, setDistance] = React.useState(0)

  const onSelectTimeZone = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      // 点击空白重置
      if (timeZone.length) {
        setTimeZone([])
        return
      }

      // let first = parseInt(id.split('-')[0], 10)
      // let second = parseInt(id.split('-')[1], 10)
      // const result: string[] = [id]
      // 选择最少半小时
      // for (let i = 1; i <= 1; ++i) {
      //   if (second === 3) {
      //     first += 1
      //     second = 0
      //   } else {
      //     second++
      //   }
      //   result.push(`${first}-${second}`)
      // }
      // const trs = document.querySelectorAll('.time-scale tr')
      // trs.forEach(tr => {
      //   tr.addEventListener('mouseenter', onSelectTimeZoneByMove)
      // })
      // document.addEventListener('mouseup', () => {
      //   trs.forEach(tr => {
      //     tr.removeEventListener('mouseenter', onSelectTimeZoneByMove)
      //   })
      // })
      // let startX = 0
      let startY = e.screenY
      let dis = 0
      function onMousemove(event: MouseEvent) {
        const deltaY = event.screenY - startY
        setDistance(deltaY)
        // if (startX === 0 && startY === 0) {
        //   startX = event.screenX
        //   startY = event.screenY
        // } else {
        //   const deltaX = event.screenX - startX
        //   const deltaY = event.screenY - startY
        //   dis += deltaY
        //   startX = event.screenX
        //   startY = event.screenY
        // }
      }
      function onMouseUp(event: MouseEvent) {
        // setDistance(dis)
        document.removeEventListener('mousemove', onMousemove)
      }
      document.removeEventListener('mousemove', onMousemove)
      document.addEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseUp)
      document.addEventListener('mouseup', onMouseUp)

      setTimeZone([id])
    },
    [timeZone],
  )

  // const onSelectTimeZoneByMove = React.useCallback((e: Event) => {
  //   const target = e.target as HTMLElement
  //   const id = target.getAttribute('data-id') as string
  //   if (!id) {
  //     return
  //   }

  //   setTimeZone(prev => {
  //     // if (prev.some(item => item === id)) {
  //     //   return prev.filter(item => item !== id)
  //     // }
  //     return [...new Set([...prev, id])]
  //   })
  // }, [])

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
            {/* <Tr
              data-id={dataId}
              bg={timeZone.includes(dataId) ? currentColor : ''}
              onMouseDown={() => onSelectTimeZone(dataId)}
              className="firstTr"
            >
              <td className="firstTd">
                <span className="time">{`${str}:00`}</span>
              </td>
              <td className="borderTop bg"></td>
            </Tr> */}
            {Array(4)
              .fill(0)
              .map((i, index) => {
                const id = `2023-03-29 ${str}:${15 * index}00`
                return (
                  <Tr
                    key={index}
                    // bg={timeZone.includes(id) ? currentColor : ''}
                    data-id={id}
                    onMouseDown={e => onSelectTimeZone(e, id)}
                  >
                    <td className="firstTd">
                      {index === 0 && (
                        <span className="time">{`${str}:00`}</span>
                      )}
                    </td>
                    <td
                      className={classNames('bg', {
                        borderTop: index === 0,
                      })}
                    ></td>
                  </Tr>
                )
              })}
          </>
        )
      })
  }, [currentColor, timeZone])
  return (
    <Table className="time-scale">
      {content}
      <CurrentTimeLine time={dayjs('2023-3-29 02:35:00').valueOf()} />
      <NewCalendarArea
        color={currentColor ?? ''}
        timeZone={timeZone}
        distance={distance}
      />
    </Table>
  )
}

export default Timescale
