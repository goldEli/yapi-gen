import CommonIconFont from '@/components/CommonIconFont'
import { DragLine } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useRef, useState } from 'react'
import {
  CalendarSidebarBox,
  CalendarSidebarMain,
  CalenderBoxLeftArea,
  FoldIcon,
} from '../../styles'
import CalendarMainSide from './CalendarMainSide'
import CalendarSetSide from './CalendarSetSide'

const SetWrap = styled.div`
  padding: 24px 0px 8px;
  white-space: nowrap;
  transition: 0.2s;
  display: none;
`

const MainWrap = styled.div`
  padding: 24px 24px 0px;
  white-space: nowrap;
  transition: 0.2s;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

interface CalendarSidebarProps {
  children?: React.ReactDOM
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = props => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
  const { routerMenu } = useSelector(store => store.calendar)
  const calendarMainSideDom = useRef<HTMLDivElement>(null)
  const calendarSideDom = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (calendarMainSideDom.current === null) return
    if (calendarSideDom.current === null) return
    if (routerMenu.key || localStorage.getItem('calendarSetKey')) {
      calendarMainSideDom.current.style.width = '0px'
      calendarSideDom.current.style.width = '100%'
      calendarSideDom.current.style.display = 'block'
      setTimeout(() => {
        if (calendarMainSideDom.current === null) return
        calendarMainSideDom.current.style.display = 'none'
      }, 100)
    } else {
      calendarSideDom.current.style.width = '0px'
      calendarMainSideDom.current.style.width = '100%'
      calendarMainSideDom.current.style.display = 'block'
      setTimeout(() => {
        if (calendarSideDom.current === null) return
        calendarSideDom.current.style.display = 'none'
      }, 100)
    }
  }, [routerMenu, localStorage.getItem('calendarSetKey')])

  return (
    <CalendarSidebarBox
      collapse={firstMenuCollapse}
      ref={sliderRef}
      style={{
        width: firstMenuCollapse ? 26 : 288,
      }}
    >
      <CalendarSidebarMain firstMenuCollapse={firstMenuCollapse}>
        <CalenderBoxLeftArea>
          <MainWrap ref={calendarMainSideDom}>
            <CalendarMainSide />
          </MainWrap>
          <SetWrap ref={calendarSideDom}>
            <CalendarSetSide />
          </SetWrap>
        </CalenderBoxLeftArea>
      </CalendarSidebarMain>
    </CalendarSidebarBox>
  )
}

export default CalendarSidebar
