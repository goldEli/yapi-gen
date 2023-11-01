import styled from '@emotion/styled'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import WriteReport from './Formwork/WriteReport'

const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
  width: 100%;
`

const WorkReport = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams) || {}

  return (
    <WorkReportWrap id="dropArea">
      {/* <HasSideCommonLayout
        hasSide={String(pathname).includes('/Report/Statistics')}
        side={
          <>
            {String(pathname).includes('/Report/Formwork') && <FormWorkSide />}
            {String(pathname).includes('/Report/Review/') && <ReviewSide />}
            {type === 'sprint' && <ProjectDetailSide />}
            {type === 'iteration' && <ProjectDetailSideIteration />}
          </>
        }
      > */}
      <Outlet />
      {/* </HasSideCommonLayout> */}
      <WriteReport
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        title={t('report.list.writeReport')}
      />
    </WorkReportWrap>
  )
}

export default WorkReport
