import { encryptPhp } from '@/tools/cryptoPhp'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { useDispatch, useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'

const useOpenDemandDetail = () => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openDemandDetail = (item: any, projectId: any, demandId: any) => {
    // 弹窗预览
    if (userPreferenceConfig.previewModel === 1) {
      dispatch({
        type: 'demand/setIsDemandDetailDrawerVisible',
        payload: true,
      })
      dispatch(saveDemandDetailDrawer(item))
    } else {
      const params = encryptPhp(
        JSON.stringify({
          type: 'info',
          id: projectId,
          demandId,
        }),
      )
      navigate(`/ProjectManagement/Demand?data=${params}`)
    }
  }

  return [openDemandDetail] as const
}

export default useOpenDemandDetail
