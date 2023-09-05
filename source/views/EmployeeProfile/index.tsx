import EmployeeProfileHeader from './components/EmployeeProfileHeader'
import { ContentWrap, Wrap } from './style'

const EmployeeProfile = () => {
  // 获取卡片数据和任务数据
  const getData = async (params: any) => {
    console.log(params)
  }
  // 获取汇报数据
  const getReportData = () => {}

  return (
    <Wrap>
      <EmployeeProfileHeader onGetData={getData} />
      <ContentWrap></ContentWrap>
    </Wrap>
  )
}

export default EmployeeProfile
