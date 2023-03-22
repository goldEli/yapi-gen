import styled from '@emotion/styled'
import React, { useMemo } from 'react'

interface CalendarDayProps {}

const CalendarDayBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Table = styled.table`
  tr {
    height: 26px;
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

const CalendarDay: React.FC<CalendarDayProps> = props => {
  const content = useMemo(() => {
    return Array(22)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx + 1)
        console.log(str.length)
        if (str.length === 1) {
          str = '0' + str
        }

        return (
          <>
            <tr className="firstTr">
              <td className="firstTd">
                <span className="time">{`${str}:00`}</span>
              </td>
              <td className="borderTop"></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </>
        )
      })
  }, [])

  return (
    <CalendarDayBox>
      <Table>{content}</Table>
    </CalendarDayBox>
  )
}

export default CalendarDay
