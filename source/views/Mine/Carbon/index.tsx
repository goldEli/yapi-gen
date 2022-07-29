import React, { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { StaffHeader } from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'

const Finished = () => {
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { getMineProjectList } = useModel('mine')

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
    <div>
      <StaffHeader>我的待办</StaffHeader>
      <MineSwiper data={swiperData} onTap={getProjectId} />
      <Need id={projectId} />
    </div>
  )
}

export default Finished
