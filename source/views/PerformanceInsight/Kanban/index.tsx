import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  return (
    <PermissionWrap
      auth="b/company/kanban"
      permission={currentMenu?.children?.map((i: any) => i.permission)}
    >
      12
    </PermissionWrap>
  )
}

export default PerformanceInsightKanBan
