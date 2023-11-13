import Home from './components/Home'
import useKeyPress from '@/hooks/useKeyPress'
import { getParamsData, getProjectType } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import RightWran from '@/hooks/useRightWran'
import { useSelector } from '@store/index'

const PerformanceInsight = () => {
  const { useKeys } = useKeyPress()
  const projectType = getProjectType()
  const [searchParams] = useSearchParams()
  // isOverAll:true是全局效能洞察，overPageType：kanBan/report模块类型
  const paramsData = getParamsData(searchParams)
  const { projectInfo } = useSelector(store => store.project)
  useKeys(
    '1',
    projectType === 1 ? '/ProjectDetail/Iteration' : '/ProjectDetail/Sprint',
  )
  useKeys(
    '2',
    projectType === 1 ? '/ProjectDetail/KanBan' : '/ProjectDetail/KanBan',
  )
  useKeys('5', projectType === 1 ? '/ProjectDetail/Demand' : '')

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      {paramsData?.isOverAll ? null : projectInfo?.project_warring_info
          ?.warring_list_nums ? (
        <RightWran />
      ) : null}
      {!paramsData?.isOverAll && <Home />}
    </div>
  )
}
export default PerformanceInsight
