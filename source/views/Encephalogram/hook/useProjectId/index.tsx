import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'

const useProjectId = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  return {
    projectId: id,
  }
}

export default useProjectId
