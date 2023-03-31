import styled from '@emotion/styled'
import React from 'react'
import classnames from 'classnames'

interface WeekHeaderProps {}

const Table = styled.table`
  width: 100%;
  height: 100%;
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

const TimeScale: React.FC<WeekHeaderProps> = props => {
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
                      className={classnames(
                        'borderRight',
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
    </Table>
  )
}

export default TimeScale
