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

const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
  width: 100%;
`

const WorkReport = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}

  const { type } = paramsData

  return (
    <WorkReportWrap id="dropArea">
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
    </WorkReportWrap>
  )
}

export default WorkReport
