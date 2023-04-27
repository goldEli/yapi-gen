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
import CommonIconFont from '@/components/CommonIconFont'

const SetWrap = styled.div`
  padding: 24px 0px 8px;
  white-space: nowrap;
  transition: 0.2s;
  display: none;
`

const MainWrap = styled.div`
  padding: 24px 4px 0px 24px;
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
  const [leftWidth, setLeftWidth] = useState(288)
  const [endWidth, setEndWidth] = useState(288)

  // 点击按钮
  const onChangeSide = () => {
    if (firstMenuCollapse) {
      setLeftWidth(288)
    } else {
      setLeftWidth(26)
    }
    setEndWidth(0)
    dispatch({
      type: 'global/setFirstMenuCollapse',
      payload: !firstMenuCollapse,
    })
  }

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
        width: firstMenuCollapse ? 26 : leftWidth,
        transition: endWidth < 288 ? '0.2s' : 'initial',
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
      <FoldIcon onClick={onChangeSide}>
        <CommonIconFont
          type={firstMenuCollapse ? 'right' : 'left'}
          size={16}
          color="var(--neutral-n2)"
        />
      </FoldIcon>
    </CalendarSidebarBox>
  )
}

export default CalendarSidebar
