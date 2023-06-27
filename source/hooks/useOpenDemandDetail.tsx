import { encryptPhp } from '@/tools/cryptoPhp'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { useDispatch, useSelector } from '@store/index'
import { setAffairsDetailDrawer, setAffairsInfo } from '@store/affairs'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import { useNavigate } from 'react-router-dom'
import { setFlawDetailDrawer, setFlawInfo } from '@store/flaw'
import { saveFlawDetailDrawer } from '@store/flaw/flaw.thunk'
import { setIsUpdateAddWorkItem } from '@store/project'
import { setDemandInfo } from '@store/demand'

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
    dispatch(setIsUpdateAddWorkItem(0))
    // 弹窗预览
    if (userPreferenceConfig.previewModel === 1) {
      switch (type) {
        case 1:
          dispatch(setAffairsDetailDrawer({ visible: true, params: item }))
          dispatch(saveAffairsDetailDrawer({ visible: true, params: item }))
          break
        case 2:
          dispatch(setFlawDetailDrawer({ visible: true, params: item }))
          dispatch(saveFlawDetailDrawer({ visible: true, params: item }))
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
      dispatch(setAffairsInfo({}))
      dispatch(setDemandInfo({}))
      dispatch(setFlawInfo({}))
      let url = ''

      if (type === 1) {
        const params = encryptPhp(
          JSON.stringify({
            id: projectId,
            sprintId: id,
            changeIds: item.demandIds,
          }),
        )
        url = `/SprintProjectManagement/SprintProjectDetail?data=${params}`
      } else if (type === 2) {
        const params = encryptPhp(
          JSON.stringify({
            id: projectId,
            flawId: id,
            changeIds: item.demandIds,
          }),
        )
        url = `/ProjectManagement/DefectDetail?data=${params}`
      } else {
        const params = encryptPhp(
          JSON.stringify({
            id: projectId,
            demandId: id,
            changeIds: item.demandIds,
          }),
        )
        url = `/ProjectManagement/DemandDetail?data=${params}`
      }
      navigate(url)
    }
  }

  return [openDemandDetail] as const
}

export default useOpenDemandDetail
