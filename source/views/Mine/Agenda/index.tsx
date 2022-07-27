import React, { useEffect, useState } from 'react'
import { useModel } from '@/models'
import {
  StaffHeader,
  TabsItem,
  TabsHehavior,
  LabNumber,
  tabCss,
} from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'

const tabsList = [{ name: '已办需求', type: 2, path: 'need' }]

const Finished = () => {
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { getMineProjectList } = useModel('mine')
  const active = 2

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
      <StaffHeader>抄送我的</StaffHeader>
      <MineSwiper data={swiperData} onTap={getProjectId} />
      <TabsHehavior>
        {tabsList.map(i => (
          <div key={i.type} className={tabCss}>
            <TabsItem isActive={active === i.type}>
              <div>{i.name}</div>
            </TabsItem>
            <LabNumber isActive={active === i.type}>5</LabNumber>
          </div>
        ))}
      </TabsHehavior>

      {active === 2 && <Need id={projectId} />}
    </div>
  )
}

export default Finished
