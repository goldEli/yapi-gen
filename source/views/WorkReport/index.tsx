import styled from '@emotion/styled'
import { Outlet, useLocation } from 'react-router-dom'
import WriteReportModal from '../../components/AllSide/FormWorkSide/WriteReport'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'
import FormWorkSide from './FormWorkSide'
import ReviewSide from './ReviewSide'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'

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

  return (
    <WorkReportWrap>
      <HasSideCommonLayout
        hasSide={!String(pathname).includes('/Report/Statistics')}
        side={
          <>
            {String(pathname).includes('/Report/Formwork') && <FormWorkSide />}
            {String(pathname).includes('/Report/Review/') && <ReviewSide />}
          </>
        }
      >
        <Outlet />
      </HasSideCommonLayout>
      <WriteReportModal
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        onConfirm={function (): void {
          throw new Error('Function not implemented.')
        }}
        title={t('report.list.writeReport')}
      />
    </WorkReportWrap>
  )
}

export default WorkReport
