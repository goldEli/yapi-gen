import { useSelector } from '@store/index'
import { ReportWrap } from '../style'
import { useEffect } from 'react'

const EmployeeProfileReport = () => {
  const { filterParams } = useSelector(store => store.employeeProfile)

  useEffect(() => {
    //调用汇报接口
    // console.log(filterParams, 'filterParamsfilterParams')
  }, [filterParams])
  return <ReportWrap>汇报</ReportWrap>
}

export default EmployeeProfileReport
