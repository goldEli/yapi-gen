import { useEffect, useRef, useState } from 'react'
import EmployeeProfileHeader from './components/EmployeeProfileHeader'
import {
  ContentWrap,
  FoldIcon,
  PersonBox,
  RightBox,
  SideMain,
  Wrap,
} from './style'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import EmployeeProfilePerson from './components/EmployeeProfilePerson'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import EmployeeProfileReport from './components/EmployeeProfileReport'
import EmployeeProfileTask from './components/EmployeeProfileTask'
import { useDispatch } from '@store/index'
import { setFilterParamsOverall } from '@store/employeeProfile'

const EmployeeProfile = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [leftWidth, setLeftWidth] = useState(320)
  const [endWidth, setEndWidth] = useState(320)
  const [focus, setFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [filterParams, setFilterParams] = useState<any>({})
  const sideMain = useRef<any>(null)
  const sliderRef = useRef<any>(null)
  const maxWidth = 600

  // 拖动线条
  const onDragLine = () => {
    let width = sliderRef.current?.clientWidth
    document.onmousemove = e => {
      setEndWidth(320)
      setFocus(true)
      if (!sideMain.current) return
      sideMain.current.style.transition = '0s'
      width = e.clientX
      if (width > maxWidth) {
        setLeftWidth(maxWidth)
      } else {
        if (isOpen) {
          setIsOpen(!isOpen)
        }
        setLeftWidth(width < 26 ? 26 : width)
      }
    }
    document.onmouseup = () => {
      if (width < 320) {
        setEndWidth(width)
        setLeftWidth(26)
        setIsOpen(true)
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
    if (isOpen) {
      setLeftWidth(320)
    } else {
      setLeftWidth(26)
    }
    setEndWidth(0)
    setIsOpen(!isOpen)
  }

  return (
    <Wrap>
      <EmployeeProfileHeader
        onChangeFilter={value => {
          setFilterParams(value)
          dispatch(setFilterParamsOverall(value))
        }}
        filterParams={filterParams}
      />
      <ContentWrap>
        <PersonBox
          isOpen={isOpen}
          ref={sliderRef}
          style={{
            width: isOpen ? 26 : leftWidth,
            transition: endWidth < 320 ? '0.2s' : 'initial',
          }}
        >
          <SideMain ref={sideMain} style={{ width: leftWidth }} isOpen={isOpen}>
            <div className="box">
              <EmployeeProfilePerson
                onChangeFilter={value => {
                  setFilterParams(value)
                  dispatch(setFilterParamsOverall(value))
                }}
                filterParams={filterParams}
              />
            </div>
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
          <Tooltip title={t('putAway') as string} placement="right">
            <FoldIcon onClick={onChangeSide}>
              <CommonIconFont
                type={isOpen ? 'right' : 'left'}
                size={16}
                color="var(--neutral-n2)"
              />
            </FoldIcon>
          </Tooltip>
        </PersonBox>
        <RightBox style={{ width: `calc(100% - ${leftWidth}px)` }}>
          <EmployeeProfileReport filterParams={filterParams} />
          <EmployeeProfileTask filterParams={filterParams} />
        </RightBox>
      </ContentWrap>
    </Wrap>
  )
}

export default EmployeeProfile
