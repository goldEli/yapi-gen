// 大概况主页

/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
// import Project from './components/Project'
// import Staff from './components/Staff'
// import Need from './components/Need'
// import Iteration from './components/Iteration'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import useSetTitle from '@/hooks/useSetTitle'
import CalendarManager from '@/components/CalendarManager'

const Wrap = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background-color: var(--white-d2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 24px;
`
const Title = styled.div`
  padding: 24px 0 0 24px;
  color: var(--neutral-n1-d1);
  font-size: 16px;
  font-weight: 500;
`

const CalendarPage = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('calendar'))
  const { menuPermission } = useSelector(store => store.user)
  const [generalData, setGeneralData] = useState<any>()

  //   if (generalData) {
  return (
    <div>
      {/* <PermissionWrap
        auth="/CalendarManager"
        permission={menuPermission?.menus?.map((i: any) => i.url)}
      > */}
      {/* <Title>{t('project.companyAll')}</Title>
          <Wrap>
            <Project data={generalData?.project} />
            <Staff data={generalData?.user} />
            <Need data={generalData?.need} />
            <Iteration data={generalData?.iterate} />
          </Wrap> */}
      <CalendarManager />
      {/* </PermissionWrap> */}
    </div>
  )
  //   }
  //   return <Loading />
}

export default CalendarPage
