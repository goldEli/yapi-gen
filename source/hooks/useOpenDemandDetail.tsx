import { encryptPhp } from '@/tools/cryptoPhp'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { useDispatch, useSelector } from '@store/index'
import { setAffairsInfo } from '@store/affairs'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setFlawInfo } from '@store/flaw'
import { saveFlawDetailDrawer } from '@store/flaw/flaw.thunk'
import {
  setDrawerCanOperation,
  setDrawerCurrentAnchor,
  setIsChangeDetailAffairs,
  setIsUpdateAddWorkItem,
} from '@store/project'
import { setDemandInfo } from '@store/demand'
import { setListActiveId } from '@store/global'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import { getParamsData } from '@/tools'

const useOpenDemandDetail = () => {
  const { userPreferenceConfig } = useSelector(store => store.user)
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
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
    dispatch(setIsChangeDetailAffairs(false))
    dispatch(setListActiveId(id ?? 0))
    // 重置锚点位置
    dispatch(setDrawerCurrentAnchor(''))
    // 浮层预览
    if (userPreferenceConfig.previewModel === 1) {
      switch (type) {
        case 1:
          // 关闭其他两个浮层
          dispatch(saveFlawDetailDrawer({ visible: false }))
          dispatch({
            type: 'demand/setIsDemandDetailDrawerVisible',
            payload: false,
          })
          dispatch(saveAffairsDetailDrawer({ visible: true, params: item }))
          break
        case 2:
          // 关闭其他两个浮层
          dispatch(saveAffairsDetailDrawer({ visible: false }))
          dispatch({
            type: 'demand/setIsDemandDetailDrawerVisible',
            payload: false,
          })
          dispatch(saveFlawDetailDrawer({ visible: true, params: item }))
          break

        default:
          // 关闭其他两个浮层
          dispatch(saveAffairsDetailDrawer({ visible: false }))
          dispatch(saveFlawDetailDrawer({ visible: false }))
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
      let params: any = {
        changeIds: item.demandIds,
        id: projectId,
        specialType: type ?? 3,
      }
      if (type === 1) {
        params.sprintId = id
      } else if (type === 2) {
        params.flawId = id
      } else {
        params.demandId = id
      }
      dispatch(saveScreenDetailModal({ visible: true, params }))
    }
  }

  const closeScreenModal = () => {
    dispatch(setDrawerCanOperation({}))
    if (paramsData?.isOpenScreenDetail) {
      const params1 = encryptPhp(
        JSON.stringify({
          ...paramsData,
          ...{ isOpenScreenDetail: null },
        }),
      )

      setSearchParams(`data=${params1}`)
      dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    }
  }

  return [openDemandDetail, closeScreenModal] as const
}

export default useOpenDemandDetail
