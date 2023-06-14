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
  // 进展对比 Progress_iteration-迭代 Progress1冲刺 ProgressAll全局
  //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局
  useEffect(() => {
    dispatch(setVisiblePerson(false))
    dispatch(setVisibleWork(false))
  }, [])
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
