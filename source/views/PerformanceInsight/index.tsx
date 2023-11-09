import Home from './components/Home'
import useKeyPress from '@/hooks/useKeyPress'
import { getParamsData, getProjectType } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import PerformanceInsightOverAll from './components'
import RightWran from '@/hooks/useRightWran'
import useForewarnModal from '@/hooks/useForewarnModal'
import { useSelector } from '@store/index'
import ProjectWarningModal from '@/components/ProjectWarningModal/ProjectWarningModal'
const PerformanceInsight = () => {
  const { useKeys } = useKeyPress()
  const projectType = getProjectType()
  const [searchParams] = useSearchParams()
  // isOverAll:true是全局效能洞察，overPageType：kanBan/report模块类型
  const paramsData = getParamsData(searchParams)
  const { projectInfo } = useSelector(store => store.project)
  useKeys(
    '1',
    projectType === 1
      ? '/ProjectManagement/Iteration'
      : '/SprintProjectManagement/Sprint',
  )
  useKeys(
    '2',
    projectType === 1
      ? '/ProjectManagement/KanBan'
      : '/SprintProjectManagement/KanBan',
  )
  useKeys('5', projectType === 1 ? '/ProjectManagement/Demand' : '')

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      {paramsData?.isOverAll ? null : projectInfo?.project_warring_info
          ?.warring_list_nums ? (
        <RightWran />
      ) : null}
      {/* {paramsData?.isOverAll ? null : projectInfo?.project_warring_info
          ?.warring_list_nums ? (
        <ProjectWarningModal></ProjectWarningModal>
      ) : null} */}
      {paramsData?.isOverAll && <PerformanceInsightOverAll />}
      {!paramsData?.isOverAll && <Home />}
    </div>
  )
}
export default PerformanceInsight
