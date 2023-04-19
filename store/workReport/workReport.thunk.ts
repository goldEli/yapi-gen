import { AppDispatch } from '@store/index'
import { setListActiveId } from '@store/global'
import { setViewReportModal } from '.'

export const saveViewReportDetailDrawer =
  (params: any) => async (dispatch: AppDispatch) => {
    dispatch(setViewReportModal(params))
    dispatch(setListActiveId(params?.id || 0))
  }
