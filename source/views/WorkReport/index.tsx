import styled from '@emotion/styled'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'
import FormWorkSide from './FormWorkSide'
import ReviewSide from './ReviewSide'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import WriteReport from './FormWorkSide/WriteReport'
import ProjectDetailSide from '../SprintProjectManagement/ProjectDetailSide'
import ProjectDetailSideIteration from '../ProjectManagement/ProjectDetailSide'
import { getParamsData } from '@/tools'
import { useState } from 'react'
import ReportAssistantModal from './Review/components/ReportAssistantModal'
const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
  width: 100%;
`
const RobotButton = styled.img`
  position: fixed;
  z-index: 99;
  bottom: 100px;
  right: 40px;
  cursor: pointer;
`

const WorkReport = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )
  const { language } = useSelector(store => store.global)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}
  const [reportAssistantModalVisible, setReportAssistantModalVisible] =
    useState(false)

  const [position, setPosition] = useState<any>({ x: null, y: null })
  const { type } = paramsData
  return (
    <WorkReportWrap
      id="dropArea"
      onDrop={(event: any) => {
        event.preventDefault()
        // 更新机器人按钮的位置
        const robotButton: any = document.querySelector('#robotButton')
        const rect = document.body?.getBoundingClientRect()
        let x = event.clientX - 56
        let y = event.clientY - 54
        if (x > rect?.width - 56) {
          x = rect?.width - 112
        }
        if (x <= 0) {
          x = 0
        }
        if (y > rect?.height - 54) {
          y = rect?.height - 108
        }
        setPosition({ x, y })
        document.body.appendChild(robotButton)
      }}
      onDragOver={(event: any) => {
        event.preventDefault()
      }}
    >
      <HasSideCommonLayout
        hasSide={String(pathname).includes('/Report/Statistics')}
        side={
          <>
            {String(pathname).includes('/Report/Formwork') && <FormWorkSide />}
            {String(pathname).includes('/Report/Review/') && <ReviewSide />}
            {type === 'sprint' && <ProjectDetailSide />}
            {type === 'iteration' && <ProjectDetailSideIteration />}
          </>
        }
      >
        <Outlet />
      </HasSideCommonLayout>
      <WriteReport
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        title={t('report.list.writeReport')}
      />
      <RobotButton
        id="robotButton"
        draggable="true"
        onClick={() => setReportAssistantModalVisible(true)}
        onDragStart={(event: any) => {
          event.dataTransfer.setData('text/plain', event.target.id)
        }}
        style={{
          left: position.x,
          top: position.y,
          // eslint-disable-next-line no-undefined
          bottom: position.x ? undefined : 200,
          // eslint-disable-next-line no-undefined
          right: position.x ? undefined : 50,
        }}
        height={108}
        src={language === 'zh' ? '/RobotButton.png' : '/RobotButtonEn.png'}
      />
      <ReportAssistantModal
        close={() => {
          setReportAssistantModalVisible(false)
        }}
        visible={reportAssistantModalVisible}
      />
    </WorkReportWrap>
  )
}

export default WorkReport
