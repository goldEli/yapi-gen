import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { oneHourHeight } from '../config'

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
const CurrentLine = styled.div`
  border-top: 1px solid #f842af;
  width: calc(100% - 58px);
  position: absolute;
  top: 180px;
  left: 58px;
  &:before {
    content: ' ';
    width: 8px;
    height: 8px;
    background: #f842af;
    position: absolute;
    top: -4px;
    left: 0;
    border-radius: 50%;
  }
  .time {
    font-size: 12px;
    font-weight: 500;
    top: -10px;
    left: -42px;
    color: #f842af;
    background: var(--neutral-white-d1);
  }
`

const Timescale: React.FC<TimescaleProps> = props => {
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
            <tr className="firstTr">
              <td className="firstTd">
                <span className="time">{`${str}:00`}</span>
              </td>
              <td className="borderTop"></td>
            </tr>
            <tr>
              <td></td>
              <td>{`${str}:15`}</td>
            </tr>
            <tr>
              <td></td>
              <td>{`${str}:35`}</td>
            </tr>
            <tr>
              <td></td>
              <td>{`${str}:45`}</td>
            </tr>
          </>
        )
      })
  }, [])
  return (
    <Table className="time-scale">
      {content}
      <CurrentLine>
        <span className="time">03:15</span>
      </CurrentLine>
    </Table>
  )
}

export default Timescale
