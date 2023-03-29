import styled from '@emotion/styled'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import CurrentTimeLine from '../../CurrentTimeLine'
import { oneHourHeight } from '../../../config'
import { useSelector } from '@store/index'
import classNames from 'classnames'

interface TimescaleProps {}
const Table = styled.table`
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  tr {
    height: ${oneHourHeight / 4}px;
    box-sizing: border-box;
  }
  td {
    box-sizing: border-box;
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

const Timescale: React.FC<TimescaleProps> = props => {
  const { list } = useSelector(store => store.calendar)
  const currentColor = useMemo(() => {
    return list.find(item => item.is_default === 1)?.color
  }, [list])
  const [timeZone, setTimeZone] = React.useState<string[]>(['0-1', '0-2'])

  const onSelectTimeZone = React.useCallback((id: string) => {
    let first = parseInt(id.split('-')[0], 10)
    let second = parseInt(id.split('-')[1], 10)
    const result: string[] = [id]
    // 选择最少半小时
    for (let i = 1; i <= 1; ++i) {
      if (second === 3) {
        first += 1
        second = 0
      } else {
        second++
      }
      result.push(`${first}-${second}`)
    }

    setTimeZone(result)
  }, [])

  const content = useMemo(() => {
    return Array(24)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx)
        // console.log(str.length)
        if (str.length === 1) {
          str = '0' + str
        }

        const dataId = `${idx}-0`
        return (
          <>
            <Tr
              data-id={dataId}
              bg={timeZone.includes(dataId) ? currentColor : ''}
              onMouseDown={() => onSelectTimeZone(dataId)}
              className="firstTr"
            >
              <td className="firstTd">
                <span className="time">{`${str}:00`}</span>
              </td>
              <td className="borderTop bg"></td>
            </Tr>
            {Array(3)
              .fill(0)
              .map((i, index) => {
                const id = `${idx}-${index + 1}`
                return (
                  <Tr
                    key={index}
                    bg={timeZone.includes(id) ? currentColor : ''}
                    data-id={id}
                    onMouseDown={() => onSelectTimeZone(id)}
                  >
                    <td></td>
                    <td className="bg"></td>
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
    </Table>
  )
}

export default Timescale
