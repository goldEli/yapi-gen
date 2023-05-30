import BasicDemand from '@/components/SprintDetailDrawer/component/BasicDemand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsInfo } from '@store/affairs/affairs.thunk'
import { useSearchParams } from 'react-router-dom'

interface Props {
  onRef: any
}

const SprintDetailBasic = (props: Props) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { affairsInfo } = useSelector(store => store.affairs)
  const onUpdate = () => {
    dispatch(getAffairsInfo({ projectId: id, sprintId }))
  }
  return (
    <div ref={props.onRef}>
      <BasicDemand
        onUpdate={onUpdate}
        detail={affairsInfo}
        isOpen
        hasPadding
        isInfoPage
      />
    </div>
  )
}

export default SprintDetailBasic
