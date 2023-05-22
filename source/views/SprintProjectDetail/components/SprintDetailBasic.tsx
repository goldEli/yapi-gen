import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { useSelector } from '@store/index'

const SprintDetailBasic = () => {
  const { demandInfo } = useSelector(store => store.demand)
  const onUpdate = () => {
    //
  }
  return <BasicDemand onUpdate={onUpdate} detail={demandInfo} />
}

export default SprintDetailBasic
