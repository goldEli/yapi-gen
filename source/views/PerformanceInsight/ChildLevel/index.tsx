import { getParamsData } from '@/tools'
import { setVisiblePerson, setVisibleWork } from '@store/performanceInsight'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ProgressComparison from '../components/ProgressComparison'

const ChildLevel = () => {
  const dispatch = useDispatch()
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
