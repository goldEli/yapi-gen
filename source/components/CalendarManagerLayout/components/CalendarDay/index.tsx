import styled from '@emotion/styled'
import React, { useMemo } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropArea from './DropArea'
import ScheduleCard from './ScheduleCard'

interface CalendarDayProps {}

const CalendarDayBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const oneHourHeight = 52

const Table = styled.table`
  /* user-select: none; */
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
// const DropArea = styled.div`
//   position: relative;
// `

const CalendarDay: React.FC<CalendarDayProps> = props => {
  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: dragItemTypes.scheduleCard,
  //   // drop: () => moveKnight(x, y),
  //   collect: monitor => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }))

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
      <DndProvider backend={HTML5Backend}>
        <DropArea>
          <Table>{content}</Table>
          <ScheduleCard />
        </DropArea>
      </DndProvider>
    </CalendarDayBox>
  )
}

export default CalendarDay
