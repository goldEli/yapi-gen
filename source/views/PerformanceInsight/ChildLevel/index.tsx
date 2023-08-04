import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import ProgressComparison from '../components/ProgressComparison'
import Undistributed from '../components/Undistributed'
const ChildLevel = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)

  return (
    <Undistributed
      title={paramsData.title}
      viewType={paramsData.viewType}
      type={paramsData.type}
      homeType={paramsData.homeType}
      projectId={paramsData.projectId}
      headerParmas={paramsData.headerParmas}
    />
    // <ProgressComparison
    //   title={paramsData.title}
    //   viewType={paramsData.viewType}
    //   type={paramsData.type}
    //   homeType={paramsData.homeType}
    //   projectId={paramsData.projectId}
    //   headerParmas={paramsData.headerParmas}
    // />
  )
}
export default ChildLevel
