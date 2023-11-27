import Home from './components/Home'
import useKeyPress from '@/hooks/useKeyPress'
import { getProjectType } from '@/tools'

const PerformanceInsight = () => {
  const { useKeys } = useKeyPress()
  const projectType = getProjectType()

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
      <Home />
    </div>
  )
}
export default PerformanceInsight
