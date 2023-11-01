import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { setWriteReportModal } from '@store/workReport'
import { useTranslation } from 'react-i18next'
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

  return (
    <WorkReportWrap id="dropArea">
      <Outlet />
      <WriteReport
        isVisible={visibleEdit}
        onClose={() => dispatch(setWriteReportModal({ visible: false }))}
        title={t('report.list.writeReport')}
      />
    </WorkReportWrap>
  )
}

export default WorkReport
