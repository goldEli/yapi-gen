import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import ProgressComparison from '../components/ProgressComparison'

const ChildLevel = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  return (
    <ProgressComparison
      title={paramsData.title}
      type={paramsData.type}
      homeType={paramsData.homeType}
      projectId={paramsData.projectId}
      headerParmas={paramsData.headerParmas}
      projectDataList={paramsData.projectDataList}
    />
  )
}
export default ChildLevel
