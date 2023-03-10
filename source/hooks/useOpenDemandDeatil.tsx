import { encryptPhp } from '@/tools/cryptoPhp'
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
      dispatch({
        type: 'demand/setDemandDetailDrawerProps',
        payload: item,
      })
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

  const closeDemandDetail = () => {
    dispatch({
      type: 'demand/setIsDemandDetailDrawerVisible',
      payload: false,
    })
    dispatch({
      type: 'demand/setDemandDetailDrawerProps',
      payload: {},
    })
  }

  return [openDemandDetail, closeDemandDetail] as const
}

export default useOpenDemandDetail
