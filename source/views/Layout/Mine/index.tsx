import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import { Outlet } from 'react-router-dom'

const Mine = () => {
  const { menuPermission } = useSelector(store => store.user)

  return (
    <PermissionWrap
      auth="Mine"
      permission={menuPermission?.menus?.map((i: any) => i.url)}
    >
      <Outlet />
    </PermissionWrap>
  )
}

export default Mine
