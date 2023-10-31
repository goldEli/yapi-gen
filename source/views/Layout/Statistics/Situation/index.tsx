// 大概况主页

/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Project from './components/Project'
import Staff from './components/Staff'
import Need from './components/Need'
import Iteration from './components/Iteration'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import useSetTitle from '@/hooks/useSetTitle'
import { getGlobalGeneral } from '@/services/user'

const Wrap = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background-color: var(--neutral-white-d2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 24px;
  height: calc(100vh - 56px);
  overflow: auto;
`

const Situation = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.general'))
  const { menuPermission } = useSelector(store => store.user)
  const [generalData, setGeneralData] = useState<any>()
  const init = async () => {
    const res = await getGlobalGeneral()
    const dateObj = {
      project: {
        ...res?.project_statistics,
        chartsData: [
          {
            type: `${t('situation.progress')} 100%`,
            sales: res.project_statistics.schedule.schedule_100,
          },
          {
            type: `${t('situation.progress')} 50~100%`,
            sales: res.project_statistics.schedule.schedule_pass50,
          },
          {
            type: `${t('situation.progress')} 0~50%`,
            sales: res.project_statistics.schedule.schedule_pass0,
          },
          {
            type: `${t('situation.progress')} 0%`,
            sales: res.project_statistics.schedule.schedule_0,
          },
        ],
      },
      user: {
        total: res.user_statistics.user_total,
        boyCount: res.user_statistics.user_count.find(
          (i: any) => i.gender === 1,
        ).count,
        girlCount: res.user_statistics.user_count.find(
          (i: any) => i.gender === 2,
        ).count,
        chartsData: res.user_statistics.position_count.map(
          (item: { position_name: any; count: any }) => {
            return {
              type: item.position_name,
              sales: item.count,
            }
          },
        ),
      },

      need: {
        total: res.story_statistics.total,
        endTotal: res.story_statistics.end_total,
        ongoingTotal: res.story_statistics.ongoing_total,
        planningTotal: res.story_statistics.planning_total,
        chartsData: (() => {
          const timeData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          res.story_statistics.line_list.create.forEach((item: any) => {
            timeData[item.month - 1] = item.number
          })
          const timeData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          res.story_statistics.line_list.ongoing.forEach((item: any) => {
            timeData2[item.month - 1] = item.number
          })
          const timeData3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          res.story_statistics.line_list.end.forEach((item: any) => {
            timeData3[item.month - 1] = item.number
          })

          return [
            {
              name: t('common.createDemand'),
              data: timeData,
            },
            {
              name: t('situation.ongoing'),
              data: timeData2,
            },
            {
              name: t('situation.end'),
              data: timeData3,
            },
          ]
        })(),
      },

      iterate: {
        ...res.iterate_statistics,
        chartsData: [
          {
            type: `${t('situation.progress')} 100%`,
            sales: res.iterate_statistics.schedule.schedule_100,
          },
          {
            type: `${t('situation.progress')} 90~100%`,
            sales: res.iterate_statistics.schedule.schedule_pass90,
          },
          {
            type: `${t('situation.progress')} 60%~90%`,
            sales: res.iterate_statistics.schedule.schedule_pass60,
          },
          {
            type: `${t('situation.progress')} 30%~60%`,
            sales: res.iterate_statistics.schedule.schedule_pass30,
          },
          {
            type: `${t('situation.progress')} 0%~30%`,
            sales: res.iterate_statistics.schedule.schedule_pass0,
          },
          {
            type: `${t('situation.progress')} 0%`,
            sales: res.iterate_statistics.schedule.schedule_0,
          },
        ],
      },
    }
    setGeneralData(dateObj)
  }
  useEffect(() => {
    init()
  }, [])

  if (generalData) {
    return (
      <PermissionWrap
        auth="/Situation"
        permission={menuPermission?.menus?.map((i: any) => i.url)}
      >
        <Wrap>
          <Project data={generalData?.project} />
          <Staff data={generalData?.user} />
          <Need data={generalData?.need} />
          <Iteration data={generalData?.iterate} />
        </Wrap>
      </PermissionWrap>
    )
  }
  return <Loading />
}

export default Situation
