import { encryptPhp } from '@/tools/cryptoPhp'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { useDispatch, useSelector } from '@store/index'
import { setSprintDetailDrawer } from '@store/sprint'
import { saveSprintDetailDrawer } from '@store/sprint/sprint.thunk'
import { useNavigate } from 'react-router-dom'

const useOpenDemandDetail = () => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // type 不传是需求，1是事务，2是缺陷
  const openDemandDetail = (
    item: any,
    projectId: any,
    id: any,
    type?: number,
  ) => {
    // 弹窗预览
    if (userPreferenceConfig.previewModel === 1) {
      switch (type) {
        case 1:
          dispatch(
            setSprintDetailDrawer({ visible: true, params: { id: 1003275 } }),
          )
          dispatch(saveSprintDetailDrawer(item))
          break
        case 2:
          // dispatch(
          //   setSprintDetailDrawer({ visible: true, params: { id: 1003275 } }),
          // )
          // dispatch(saveDemandDetailDrawer(item))
          break

        default:
          dispatch({
            type: 'demand/setIsDemandDetailDrawerVisible',
            payload: true,
          })
          dispatch(saveDemandDetailDrawer(item))
          break
      }
    } else {
      let url = ''

      if (type === 1) {
        const params = encryptPhp(
          JSON.stringify({
            id: projectId,
            sprintId: id,
          }),
        )
        url = `/SprintProjectManagement/SprintProjectDetail?data=${params}`
      } else if (type === 2) {
        //
      } else {
        const params = encryptPhp(
          JSON.stringify({
            type: 'info',
            id: projectId,
            demandId: id,
          }),
        )
        url = `/ProjectManagement/Demand?data=${params}`
      }
      navigate(url)
    }
  }

  return [openDemandDetail] as const
}

export default useOpenDemandDetail