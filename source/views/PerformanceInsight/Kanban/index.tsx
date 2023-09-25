import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import KanBanHeader from './components/KanBanHeader'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  return (
    <PermissionWrap
      auth="b/company/kanban"
      permission={currentMenu?.children?.map((i: any) => i.permission)}
    >
      <KanBanHeader />
    </PermissionWrap>
  )
}

export default PerformanceInsightKanBan
