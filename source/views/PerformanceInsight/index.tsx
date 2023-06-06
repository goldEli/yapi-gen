import Home from './components/Home'
import useKeyPress from '@/hooks/useKeyPress'
import { getProjectType } from '@/tools'
const PerformanceInsight = () => {
  const { useKeys } = useKeyPress()
  const projectType = getProjectType()
  console.log('projectType---', projectType)
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
  return (
    <div style={{ width: '100%' }}>
      <Home />
    </div>
  )
}
export default PerformanceInsight
