import { AppDispatch } from '@store/index'
import { setDemandDetailDrawerProps } from '.'
import { setListActiveId } from '@store/global'

export const saveDemandDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setDemandDetailDrawerProps(params))
    dispatch(setListActiveId(params?.id ?? 0))
  }
