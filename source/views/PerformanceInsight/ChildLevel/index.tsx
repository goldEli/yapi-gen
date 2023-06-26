import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import ProgressComparison from '../components/ProgressComparison'

const ChildLevel = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  console.log(paramsData, 'paramsData')
  return (
    <ProgressComparison
      title={paramsData.title}
      viewType={paramsData.viewType}
      type={paramsData.type}
      homeType={paramsData.homeType}
      projectId={paramsData.projectId}
      headerParmas={paramsData.headerParmas}
    />
  )
}
export default ChildLevel
