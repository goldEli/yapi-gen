import React, { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { StaffHeader } from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools'

const Finished = () => {
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { getMineProjectList } = useModel('mine')
  const { userInfo } = useModel('user')

  const init = async () => {
    const res = await getMineProjectList('copysend')
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
      auth={getIsPermission(
        userInfo?.company_permissions,
        'b/user/copysend/story',
      )}
    >
      <StaffHeader>抄送我的</StaffHeader>
      <MineSwiper data={swiperData} onTap={getProjectId} />
      <Need id={projectId} />
    </PermissionWrap>
  )
}

export default Finished
