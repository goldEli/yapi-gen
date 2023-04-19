import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import WriteReportModal from '../../components/AllSide/FormWorkSide/WriteReport'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'

const WorkReportWrap = styled.div`
  position: relative;
  height: 100%;
  background: var(--neutral-white-d1);
`
const WorkReport = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { visible: visibleEdit } = useSelector(
    state => state.workReport.writeReportModal,
  )

  return (
    <WorkReportWrap>
      <Outlet />
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
