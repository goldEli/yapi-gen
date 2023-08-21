import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import WorkHoursPanel from './components/WorkHoursPanel'
import { WorkHoursWrap, MianWrap } from './style'
import WorkHoursHeader from './components/WorkHoursHeader'
import TableLeft from './components/TableLeft'

interface IProps {}
const WorkHours: React.FC<IProps> = props => {
  const [t] = useTranslation()
  const [formVal, setFormVal] = useState<any>()
  const onInputSearch = (val: any) => {
    console.log(val)
  }
  return (
    <WorkHoursWrap>
      <ProjectCommonOperation
        onInputSearch={onInputSearch}
        title={t('search_for_transaction_name_or_number')}
      />

      <WorkHoursHeader
        onSearch={(val: any) => {
          setFormVal(val), console.log(val)
        }}
      />
      <MianWrap>
        <TableLeft />
        <WorkHoursPanel />
      </MianWrap>
    </WorkHoursWrap>
  )
}
export default WorkHours
