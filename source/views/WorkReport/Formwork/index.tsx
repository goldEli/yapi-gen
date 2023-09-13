/* eslint-disable @typescript-eslint/naming-convention */
import PermissionWrap from '@/components/PermissionWrap'
import RightFormWork from './RightWrap'
import { useDispatch, useSelector } from '@store/index'
import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { setActiveItem, setEditSave } from '@store/formWork'
const FormWork = () => {
  const [t]: any = useTranslation()
  const asyncSetTtile = useSetTitle()
  const dispatch = useDispatch()
  asyncSetTtile(`${t('formWork.t1')}`)
  const { currentMenu } = useSelector(store => store.user)
  useEffect(() => {
    return () => {
      dispatch(setEditSave(true))
      dispatch(setActiveItem(null))
    }
  })

  return (
    <PermissionWrap
      auth="/Report/Formwork"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <RightFormWork />
    </PermissionWrap>
  )
}
export default FormWork
