import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import { Outlet } from 'react-router-dom'
import AdminSide from './AdminSide'
import HasSideCommonLayout from '@/components/HasSideCommonLayout'

const AdminManagement = () => {
  const { menuPermission } = useSelector(store => store.user)

  return (
    <PermissionWrap
      auth="/AdminManagement"
      permission={menuPermission?.menus?.map((i: any) => i.url)}
    >
      <HasSideCommonLayout side={<AdminSide />}>
        <Outlet />
      </HasSideCommonLayout>
    </PermissionWrap>
  )
}

export default AdminManagement
