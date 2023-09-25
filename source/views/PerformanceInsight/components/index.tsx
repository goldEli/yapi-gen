import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import PerformanceInsightSide from './PerformanceInsightSide'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import Home from './Home'
import PerformanceInsightKanBan from '../Kanban'

const PerformanceInsightOverAll = () => {
  const [searchParams] = useSearchParams()
  // isOverAll:true是全局效能洞察，overPageType：kanBan/report模块类型
  const paramsData = getParamsData(searchParams)
  return (
    <HasSideCommonLayout
      side={<PerformanceInsightSide overPageType={paramsData?.overPageType} />}
    >
      {paramsData?.overPageType === 'report' && <Home />}
      {paramsData?.overPageType === 'kanBan' && <PerformanceInsightKanBan />}
    </HasSideCommonLayout>
  )
}

export default PerformanceInsightOverAll
