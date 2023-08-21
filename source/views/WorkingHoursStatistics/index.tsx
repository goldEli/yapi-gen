import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import WorkHoursPanel from './components/WorkHoursPanel'
import { WorkHoursWrap, MianWrap, Line, SprintDetailMouseDom } from './style'
import WorkHoursHeader from './components/WorkHoursHeader'
import TableLeft from './components/TableLeft'

interface IProps {}
const WorkHours: React.FC<IProps> = props => {
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(400)
  const [focus, setFocus] = useState(false)
  const [t] = useTranslation()
  const onInputSearch = () => {}
  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)
      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }
  return (
    <WorkHoursWrap>
      <ProjectCommonOperation
        onInputSearch={onInputSearch}
        title={t('search_for_transaction_name_or_number')}
      />

      <WorkHoursHeader />
      <MianWrap>
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: `calc(100% - ${leftWidth}px)`,
          }}
        >
          <TableLeft />
        </div>
        <div style={{ position: 'relative', width: leftWidth }}>
          <SprintDetailMouseDom
            active={focus}
            onMouseDown={onDragLine}
            style={{ left: 0 }}
          >
            <Line active={focus} className="line"></Line>
          </SprintDetailMouseDom>
          <WorkHoursPanel></WorkHoursPanel>
        </div>
      </MianWrap>
    </WorkHoursWrap>
  )
}
export default WorkHours
