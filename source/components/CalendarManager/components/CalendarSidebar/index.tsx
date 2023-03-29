import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import { DragLine } from '@/components/StyleCommon'
import { useDispatch, useSelector } from '@store/index'
import { useRef, useState } from 'react'
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

interface CalendarSidebarProps {
  children?: React.ReactDOM
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = props => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
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
          <CommonButton type="primary">
            <CreateScheduleBtn>
              <IconFont type="plus" style={{ fontSize: 16 }} />
              <span className="btnText">创建日程</span>
            </CreateScheduleBtn>
          </CommonButton>
          <DXCalendar />
          <InputSearch
            placeholder={'搜索日历'}
            width={210}
            autoFocus
            leftIcon
          />
          <CalendarManagerList title="我管理的" type="manage" />
          <CalendarManagerList title="我订阅的" type="sub" />
          <CalendarSetBox>
            <IconFont
              type="settings"
              style={{ fontSize: 18, color: 'var(--neutral-n3)' }}
            />
            <div>日历设置</div>
          </CalendarSetBox>
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
