import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import dayjs from 'dayjs'
import React from 'react'
import classnames from 'classnames'

interface WeekHeaderProps {}

const WeekHeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  box-sizing: border-box;
  top: 0px;
  left: 0px;
  background: var(--neutral-white-d1);
  z-index: 1;
`
const Top = styled.div`
  display: flex;
  height: 64px;
  font-size: 16px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
`
const Bottom = styled.div`
  height: 60px;
`
const TimeZone = styled.div`
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  position: absolute;
  bottom: -12px;
  left: -6px;
`

const WeekList = styled.div`
  flex: 1;
  display: flex;
  box-sizing: border-box;
  padding-left: 58px;
`
const WeekListItem = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 6px 12px;

  display: flex;
  flex-direction: column;
  gap: 1px;
  .weekDay {
  }
  .monthDay {
    font-size: 18px;
    font-weight: 500;
  }
  .lunar {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n2);
  }
  .selectedDay {
    display: inline-block;
    width: 28px;
    height: 28px;
    background: var(--primary-d1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--neutral-white-d7) !important;
  }
  .bottom {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .weekend {
    color: var(--neutral-n4);
  }
`
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

const WeekHeader: React.FC<WeekHeaderProps> = props => {
  const { selectedWeek, selectedDay } = useSelector(store => store.calendar)
  return (
    <WeekHeaderBox>
      <Top>
        <TimeZone>GTM+08</TimeZone>
        <WeekList>
          {selectedWeek.map(item => {
            const date = dayjs(item.date)
            const weekDay = date.format('ddd')
            const monthDay = date.format('DD')
            const currentWeekDayNum = date.format('d')
            // 周六周日
            const weekDayNums = ['0', '6']
            const classname = classnames('monthDay', {
              weekend: weekDayNums.includes(currentWeekDayNum),
              selectedDay:
                date.format('DD/MM/YYYY') ===
                dayjs(selectedDay).format('DD/MM/YYYY'),
            })

            return (
              <WeekListItem key={date.valueOf()}>
                <span
                  className={classnames('weekDay', {
                    weekend: weekDayNums.includes(currentWeekDayNum),
                  })}
                >
                  {weekDay}
                </span>
                <div className="bottom">
                  <span className={classname}>{monthDay}</span>
                  <span
                    className={classnames('lunar', {
                      weekend: weekDayNums.includes(currentWeekDayNum),
                    })}
                  >
                    初一
                  </span>
                </div>
              </WeekListItem>
            )
          })}
        </WeekList>
      </Top>
      <Bottom>
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
      </Bottom>
    </WeekHeaderBox>
  )
}

export default WeekHeader
