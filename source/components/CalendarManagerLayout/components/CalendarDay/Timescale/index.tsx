import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { oneHourHeight } from '../config'

interface TimescaleProps {}
const Table = styled.table`
  /* user-select: none; */
  width: 100%;
  box-sizing: border-box;
  tr {
    height: ${oneHourHeight / 2}px;
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

const Timescale: React.FC<TimescaleProps> = props => {
  const content = useMemo(() => {
    return Array(22)
      .fill(0)
      .map((item, idx) => {
        let str = String(idx)
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
  return <Table>{content}</Table>
}

export default Timescale
