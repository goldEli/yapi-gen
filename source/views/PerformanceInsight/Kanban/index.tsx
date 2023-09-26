/* eslint-disable no-undefined */
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import KanBanHeader from './components/KanBanHeader'
import { useEffect, useState } from 'react'

const PerformanceInsightKanBan = () => {
  const { currentMenu } = useSelector(store => store.user)
  // 筛选条件
  const [filterParams, setFilterParams] = useState<any>({})
  // 统计数据
  const [statistics, setStatistics] = useState<any>({})
  // 人员数据
  const [dataList, setDataList] = useState({
    list: undefined,
    total: 0,
  })
  // 人员数据分页
  const [personPage, setPersonPage] = useState(1)

  // 获取统计数据
  const getStatistics = async () => {
    setStatistics({
      planned: 20,
      completed: 12,
      progress: 10,
      overdue: 5,
    })
  }

  // 获取人员看板数据
  const getDataList = async (page: number) => {}

  // 刷新功能
  const onUpdate = () => {
    getStatistics()
    getDataList(1)
  }

  // 四个筛选条件更新统计数据
  useEffect(() => {
    // 更新统计数据
    getStatistics()
  }, [
    filterParams?.keyword,
    filterParams?.time,
    filterParams?.user_ids,
    filterParams?.iteration,
  ])

  return (
    <PermissionWrap
      auth="b/company/kanban"
      permission={currentMenu?.children?.map((i: any) => i.permission)}
    >
      <KanBanHeader
        onChangeFilter={value => {
          setFilterParams(value)
        }}
        onUpdate={onUpdate}
        statistics={statistics}
      />
    </PermissionWrap>
  )
}

export default PerformanceInsightKanBan
