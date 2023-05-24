import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { useSelector } from '@store/index'

const SprintDetailBasic = () => {
  const { sprintInfo } = useSelector(store => store.sprint)
  const onUpdate = () => {
    //
  }
  return <BasicDemand onUpdate={onUpdate} detail={sprintInfo} isOpen />
}

export default SprintDetailBasic
