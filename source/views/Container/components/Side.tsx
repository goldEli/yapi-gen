import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { useRef, useState, useEffect } from 'react'
import ProjectDetailSide from '@/components/AllSide/ProjectDetailSide'
import ProjectSide from '@/components/AllSide/ProjectSide'
import AdminSide from '@/components/AllSide/AdminSide'
import { useLocation } from 'react-router-dom'
import MineSide from '@/components/AllSide/MineSide'
import LogSide from '@/components/AllSide/LogSide'
import HisSide from '@/components/AllSide/HisSide'
import { DragLine } from '@/components/StyleCommon'

const SideWrap = styled.div<{ firstMenuCollapse: boolean }>`
  width: ${props => (props.firstMenuCollapse ? 0 : 200)}px;
  height: 100%;
  align-items: center;
  max-width: unset !important;
  min-width: unset !important;
  flex: unset !important;
  border-right: 1px solid #ecedef;
  background: ${props =>
    props.firstMenuCollapse ? 'var(--neutral-white-d6)' : 'var(--neutral-n9)'};
  position: relative;
`

const FoldIcon = styled.div`
  position: absolute;
  top: 24px;
  width: 24px;
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
  const [activeType, setActiveType] = useState(0)
  const [groupId, setGroupId] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })

  useEffect(() => {
    props.onChangeLeft(leftWidth)
  }, [leftWidth])

  // 拖动线条
  const onDragLine = (event: any) => {
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

  // 切换分组查询列表
  const onChangeGroup = (id: number) => {
    setGroupId(id)
    setActiveType(-1)
  }

  const onChangeType = (type: number) => {
    setActiveType(type)
    setGroupId(null)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  const onAddClick = () => {
    setIsVisible(true)
    setOperationDetail({})
  }

  const getClassSide = () => {
    let nodeComponent: any

    if (pathname === '/ProjectManagement/Project') {
      nodeComponent = (
        <ProjectSide
          onAddClick={onAddClick}
          onChangeType={onChangeType}
          activeType={activeType}
          onChangeGroup={onChangeGroup}
        />
      )
    } else if (
      String(pathname).includes('/ProjectManagement/MemberInfo') ||
      String(pathname).includes('/MemberInfo')
    ) {
      nodeComponent = <HisSide />
    } else if (String(pathname).includes('/AdminManagement')) {
      nodeComponent = <AdminSide />
    } else if (String(pathname).includes('/ProjectManagement/Mine')) {
      nodeComponent = <MineSide />
    } else if (String(pathname).includes('/LogManagement')) {
      nodeComponent = <LogSide />
    } else if (String(pathname).includes('/ProjectManagement/')) {
      nodeComponent = <ProjectDetailSide />
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
    </SideWrap>
  )
}

export default Side
