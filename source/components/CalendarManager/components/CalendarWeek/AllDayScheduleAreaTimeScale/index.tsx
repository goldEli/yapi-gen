import styled from '@emotion/styled'
import React from 'react'
import classnames from 'classnames'
import { css } from '@emotion/css'
import useMaxWidth from '../hooks/useMaxWidth'

interface WeekHeaderProps {}

const Table = styled.table`
  width: 100%;
  height: 100%;
  position: relative;
  .firstTd {
    width: 58px;
  }
  tr {
    box-sizing: border-box;
    /* all: unset; */
  }
  td {
    box-sizing: border-box;
    /* all: unset; */
  }
  .borderTop {
    border-top: 1px solid var(--neutral-n6-d1);
  }
  .borderRight {
    border-right: 1px solid var(--neutral-n6-d1);
  }
`
const activeColor = css`
  background-color: var(--neutral-n6-d1);
`
const Title = styled.div<{ left: number }>`
  color: var(--primary-d1);
  width: calc((100% - 58px) / 7);
  font-size: 12px;
  font-weight: 400;
  background: var(--function-tag5);
  height: 22px;
  position: absolute;
  left: ${props => props.left + 'px'};
  top: 0;
  display: flex;
  align-items: center;
  z-index: 100;
`

const TimeScale: React.FC<WeekHeaderProps> = props => {
  const [current, setCurrent] = React.useState<number | null>(null)
  const onCreate = (idx: number) => {
    setCurrent(idx)
  }
  const { maxWidth } = useMaxWidth()
  return (
    <Table>
      {Array(4)
        .fill(0)
        .map((_, index) => {
          return (
            <tr key={index}>
              {Array(8)
                .fill(0)
                .map((item, idx) => {
                  return (
                    <td
                      onClick={() => onCreate(idx)}
                      className={classnames(
                        'borderRight',
                        { [activeColor]: idx === current },
                        { borderTop: index === 0 && idx !== 0 },
                        {
                          firstTd: idx === 0,
                        },
                      )}
                      key={idx}
                    ></td>
                  )
                })}
            </tr>
          )
        })}
      {current !== null && (
        <Title left={58 + maxWidth * ((current ?? 0) - 1)}>新建日程</Title>
      )}
    </Table>
  )
}

export default TimeScale
