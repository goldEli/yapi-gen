import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { DragLine } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useRef, useState } from 'react'
import {
  CalendarSetBox,
  CalendarSidebarBox,
  CalendarSidebarMain,
  CalenderBoxLeftArea,
  CreateScheduleBtn,
  FoldIcon,
} from '../../styles'
import CalendarManagerList from '../CalendarManagerList'
import DXCalendar from '../DXCalendar'
import CalendarMainSide from './CalendarMainSide'
import CalendarSetSide from './CalendarSetSide'

const SetWrap = styled.div`
  padding: 24px 0px 8px;
  white-space: nowrap;
  transition: 0.2s;
  display: none;
`

const MainWrap = styled.div`
  padding: 24px 24px 8px;
  white-space: nowrap;
  transition: 0.2s;
`

interface CalendarSidebarProps {
  children?: React.ReactDOM
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = props => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
  const { routerMenu } = useSelector(store => store.calendar)
  const calendarMainSideDom: any = useRef<HTMLElement>(null)
  const calendarSideDom: any = useRef<HTMLElement>(null)
  const sliderRef = useRef<any>(null)
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(288)
  const [endWidth, setEndWidth] = useState(288)
  const [focus, setFocus] = useState(false)

  // 拖动线条
  const onDragLine = () => {
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
    if (routerMenu.key) {
      calendarMainSideDom.current.style.width = '0px'
      calendarSideDom.current.style.width = '100%'
      calendarSideDom.current.style.display = 'block'
      calendarMainSideDom.current.style.display = 'none'
    } else {
      calendarSideDom.current.style.width = '0px'
      calendarMainSideDom.current.style.width = '100%'
      calendarMainSideDom.current.style.display = 'block'
      calendarSideDom.current.style.display = 'none'
    }
  }, [routerMenu])

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
