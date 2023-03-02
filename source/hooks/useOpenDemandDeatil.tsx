import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch, useSelector } from '@store/index'

const useOpenDemandDetail = () => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()

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
      const url = `/ProjectManagement/Demand?data=${params}`
      window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    }
  }

  return [openDemandDetail] as const
}

export default useOpenDemandDetail
