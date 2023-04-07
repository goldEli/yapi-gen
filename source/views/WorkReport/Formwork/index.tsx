/* eslint-disable @typescript-eslint/naming-convention */
import PermissionWrap from '@/components/PermissionWrap'
import RightFormWork from './RightWrap'
import { useSelector } from '@store/index'

const FormWork = () => {
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
