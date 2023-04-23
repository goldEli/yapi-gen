/* eslint-disable @typescript-eslint/naming-convention */
import PermissionWrap from '@/components/PermissionWrap'
import RightFormWork from './RightWrap'
import { useSelector } from '@store/index'
import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'

const FormWork = () => {
  const [t]: any = useTranslation()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(`${t('formWork.t1')}`)
  const { currentMenu } = useSelector(store => store.user)
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
