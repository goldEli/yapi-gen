import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getSprintInfo } from '@store/sprint/sprint.thunk'
import { useSearchParams } from 'react-router-dom'

const SprintDetailBasic = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { sprintInfo } = useSelector(store => store.sprint)
  const onUpdate = () => {
    dispatch(getSprintInfo({ projectId: id, sprintId }))
  }
  return (
    <BasicDemand
      onUpdate={onUpdate}
      detail={sprintInfo}
      isOpen
      hasPadding
      isInfoPage
    />
  )
}

export default SprintDetailBasic
