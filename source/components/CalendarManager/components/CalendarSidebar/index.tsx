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
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(288)
  const [endWidth, setEndWidth] = useState(288)
  const [focus, setFocus] = useState(false)

  // 拖动线条
  const onDragLine = () => {
    if (sliderRef.current === null) return
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(288)
      setFocus(true)
      width = e.clientX
      if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        if (firstMenuCollapse) {
          dispatch({
            type: 'global/setFirstMenuCollapse',
            payload: !firstMenuCollapse,
          })
        }
        setLeftWidth(width < 26 ? 26 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 288) {
        setEndWidth(width)
        setLeftWidth(26)
        dispatch({
          type: 'global/setFirstMenuCollapse',
          payload: true,
        })
      } else if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        setLeftWidth(width)
      }
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

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

      <DragLine
        onMouseDown={onDragLine}
        style={{ left: leftWidth - 1 }}
        active={focus}
      />
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
