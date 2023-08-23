import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import SiteNotificationSide from './components/SiteNotificationSide/SiteNotificationSide'
import AllSide from './components/AllSide/AllSide'

const SideWrap = styled.div<{
  firstMenuCollapse: boolean
  permission?: boolean
}>`
  width: ${props => (props.firstMenuCollapse ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  border-right: 1px solid var(--neutral-n6-d1);
  background: ${props =>
    props.firstMenuCollapse ? 'var(--neutral-white-d6)' : 'var(--neutral-n9)'};
  position: relative;
`

const FoldIcon = styled.div`
  position: absolute;
  width: 24px;
  top: 50%;
  width: 24px;
  transform: translateY(-50%);
  height: 24px;
  background: var(--neutral-white-d3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 6px 0px rgba(24, 43, 71, 0.12);
  z-index: 2;
  right: -12px;
  cursor: pointer;
  &:hover {
    background: var(--primary-d1);
    svg {
      color: var(--neutral-white-d7);
    }
  }
`

const SideMain = styled.div<{ firstMenuCollapse: boolean }>`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s;
  display: ${props => (props.firstMenuCollapse ? 'none' : 'block')};
`

const Side = (props: { onChangeLeft(value: number): void }) => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
  const sliderRef = useRef<any>(null)
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(200)
  const [endWidth, setEndWidth] = useState(200)
  const [focus, setFocus] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    props.onChangeLeft(leftWidth)
  }, [leftWidth])

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(200)
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
      if (width < 200) {
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
      setLeftWidth(200)
    } else {
      setLeftWidth(26)
    }
    setEndWidth(0)
    dispatch({
      type: 'global/setFirstMenuCollapse',
      payload: !firstMenuCollapse,
    })
  }

  const getClassSide = () => {
    let nodeComponent: any

    if (String(pathname).includes('Setting')) {
      nodeComponent = <SiteNotificationSide />
    } else if (String(pathname).includes('AllNote')) {
      nodeComponent = <AllSide />
    } else if (String(pathname).includes('Email')) {
      nodeComponent = <SiteNotificationSide />
    }

    return nodeComponent
  }

  useEffect(() => {
    getClassSide()
  }, [pathname])

  return (
    <SideWrap
      firstMenuCollapse={firstMenuCollapse}
      ref={sliderRef}
      style={{
        width: firstMenuCollapse ? 26 : leftWidth,
        transition: endWidth < 200 ? '0.2s' : 'initial',
      }}
    >
      <SideMain firstMenuCollapse={firstMenuCollapse}>
        {getClassSide()}
      </SideMain>

      <MouseDom
        active={focus}
        onMouseDown={onDragLine}
        style={{ left: leftWidth - 6 }}
      >
        <DragLine active={focus} className="line" />
      </MouseDom>
      <FoldIcon onClick={onChangeSide}>
        <CommonIconFont
          type={firstMenuCollapse ? 'right' : 'left'}
          size={16}
          color="var(--neutral-n2)"
        />
      </FoldIcon>
    </SideWrap>
  )
}

export default Side
