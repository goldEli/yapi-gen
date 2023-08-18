import React from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { WorkHoursWrap } from './style'
import WorkHoursHeader from './components/WorkHoursHeader'
interface IProps {}
const WorkHours: React.FC<IProps> = props => {
  const [t, i18n] = useTranslation()
  const onInputSearch = () => {}
  return (
    <WorkHoursWrap>
      <ProjectCommonOperation
        onInputSearch={onInputSearch}
        title={t('search_for_transaction_name_or_number')}
      />
      <WorkHoursHeader />
    </WorkHoursWrap>
  )
}
export default WorkHours
