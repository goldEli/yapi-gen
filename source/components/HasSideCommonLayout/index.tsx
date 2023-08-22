import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useRef, useState } from 'react'
import { DragLine, MouseDom } from '@/components/StyleCommon'

interface HasSideCommonLayoutProps {
  side?: React.ReactNode
  children: React.ReactNode
  hasSide?: boolean
}

const HasSideWrap = styled.div`
  display: flex;
  height: 100%;
  overflow: auto;
  flex: 1;
`

const SideWrap = styled.div<{ isOpen: boolean; permission?: boolean }>`
  width: ${props => (props.isOpen ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  border-right: 1px solid var(--neutral-n6-d1);
  background: ${props =>
    props.isOpen ? 'var(--neutral-white-d6)' : 'var(--neutral-n9)'};
  position: relative;
  .ant-menu-inline .ant-menu-item,
  .ant-menu-inline .ant-menu-submenu-title {
    width: 100%;
  }
`

const FoldIcon = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--neutral-white-d3);
  border-radius: 50%;
  top: 50%;
  width: 24px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 6px 0px rgba(24, 43, 71, 0.12);
  z-index: 12;
  right: -12px;
  cursor: pointer;
  :hover svg {
    color: var(--primary-d1);
  }
`

const SideMain = styled.div<{ isOpen: boolean }>`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s;
  .box {
    opacity: ${props => (props.isOpen ? 0 : 1)};
    height: 100%;
  }
`

const OutletWrap = styled.div<{ width: number }>`
  flex: 1;
  overflow: auto;
  height: 100%;
  overflow-y: hidden;
`

const HasSideCommonLayout = (props: HasSideCommonLayoutProps) => {
  const dispatch = useDispatch()
  const { firstMenuCollapse } = useSelector(state => state.global)
  const sliderRef = useRef<any>(null)
  const sideMain = useRef<HTMLDivElement>(null)
  const maxWidth = 422
  const [leftWidth, setLeftWidth] = useState(200)
  const [endWidth, setEndWidth] = useState(200)
  const [focus, setFocus] = useState(false)

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(200)
      setFocus(true)
      if (!sideMain.current) return
      sideMain.current.style.transition = '0s'
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
      if (!sideMain.current) return
      sideMain.current.style.transition = '0.3s'
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  // 点击按钮
  const onChangeSide = () => {
    if (!sideMain.current) return
    sideMain.current.style.transition = '0.3s'
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

  return (
    <HasSideWrap>
      {!props.hasSide && (
        <SideWrap
          id="sidebar_yang"
          isOpen={firstMenuCollapse}
          ref={sliderRef}
          style={{
            width: firstMenuCollapse ? 26 : leftWidth,
            transition: endWidth < 200 ? '0.2s' : 'initial',
          }}
        >
          <SideMain
            ref={sideMain}
            style={{ width: leftWidth }}
            isOpen={firstMenuCollapse}
          >
            <div className="box">{props.side}</div>
          </SideMain>

          <MouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: leftWidth - 6 }}
          >
            <DragLine
              active={focus}
              className="line"
              style={{ marginLeft: 4 }}
            />
          </MouseDom>

          <FoldIcon onClick={onChangeSide}>
            <CommonIconFont
              type={firstMenuCollapse ? 'right' : 'left'}
              size={16}
              color="var(--neutral-n2)"
            />
          </FoldIcon>
        </SideWrap>
      )}
      <OutletWrap width={leftWidth}>
        <div
          style={{
            minWidth: `${1440 - leftWidth}px`,
            height: '100%',
            // overflow: 'scroll',
          }}
        >
          {props.children}
        </div>
      </OutletWrap>
    </HasSideWrap>
  )
}

export default HasSideCommonLayout
