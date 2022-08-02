import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { StaffHeader } from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'
import PermissionWrap from '@/components/PermissionWrap'

const Finished = () => {
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { getMineProjectList } = useModel('mine')
  const { userInfo } = useModel('user')

  const init = async () => {
    const res = await getMineProjectList('finish')
    setSwiperData(res.data)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProjectId = (value: any) => {
    setProjectId(value)
  }

  return (
    <PermissionWrap
      auth="b/user/copysend/story"
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>我的已办</StaffHeader>
      <MineSwiper data={swiperData} onTap={getProjectId} />
      <Need id={projectId} />
    </PermissionWrap>
  )
}

export default Finished
