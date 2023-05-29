import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getSprintInfo } from '@store/sprint/sprint.thunk'
import { useSearchParams } from 'react-router-dom'

interface Props {
  onRef: any
}

const SprintDetailBasic = (props: Props) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { sprintInfo } = useSelector(store => store.sprint)
  const onUpdate = () => {
    dispatch(getSprintInfo({ projectId: id, sprintId }))
  }
  return (
    <div ref={props.onRef}>
      <BasicDemand
        onUpdate={onUpdate}
        detail={sprintInfo}
        isOpen
        hasPadding
        isInfoPage
      />
    </div>
  )
}

export default SprintDetailBasic
