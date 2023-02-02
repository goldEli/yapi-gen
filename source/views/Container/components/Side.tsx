import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useRef, useState } from 'react'

const SideWrap = styled.div<{ firstMenuCollapse: boolean }>`
  width: ${props => (props.firstMenuCollapse ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  background: #f2f8d2;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  z-index: 9;
  overflow: hidden;
  background: ${(props: any) => props.theme.side};
`

const Line = styled.div<{ active: boolean }>`
  position: absolute;
  width: 1px;
  cursor: col-resize;
  overflow: hidden;
  z-index: 4;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
  top: 0;
  background-size: 100% 12px;
  background-repeat: repeat-y;
  background-image: ${({ active }) =>
    active
      ? 'linear-gradient(to bottom, #617ef2 0%, #617ef2 80%, transparent 50%)'
      : 'none'};
  &:hover {
    background-image: linear-gradient(
      to bottom,
      #617ef2 0%,
      #617ef2 80%,
      transparent 50%
    );
  }
`

const Side = () => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
  const sliderRef = useRef<any>(null)
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(200)
  const [endWidth, setEndWidth] = useState(200)
  const [focus, setFocus] = useState(false)

  const onDragLine = (event: any) => {
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
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
        setLeftWidth(width)
      }
    }
    document.onmouseup = () => {
      if (width < 200) {
        setEndWidth(width)
        setLeftWidth(26)
        dispatch({
          type: 'global/setFirstMenuCollapse',
          payload: !firstMenuCollapse,
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

  return (
    <SideWrap
      firstMenuCollapse={firstMenuCollapse}
      ref={sliderRef}
      style={{
        width: firstMenuCollapse ? 26 : leftWidth,
        transition: endWidth < 200 ? '0.2s' : 'initial',
      }}
    >
      121221
      <Line
        onMouseDown={onDragLine}
        style={{
          left: leftWidth - 3,
        }}
        active={focus}
      />
    </SideWrap>
  )
}

export default Side
