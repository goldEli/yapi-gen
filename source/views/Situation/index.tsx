// 大概况主页

/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import Project from './components/Project'
import { Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import CompanyModal from '@/components/CompanyModal'
import Staff from './components/Staff'
import Need from './components/Need'
import Iteration from './components/Iteration'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import useSetTitle from '@/hooks/useSetTitle'
import { getGlobalGeneral } from '@/services/user'

const buttonCss = css``
const PanelHeaderSecond = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  display: flex;
`
const Wrap = styled.div`
  box-sizing: border-box;
  padding: 16px;
  background-color: #f5f7fa;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 16px;
`
const Head = styled.div`
  height: 64px;
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`

const Situation = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.general'))
  const { userInfo } = useSelector(store => store.user)
  const [companyModalVisible, setCompanyModalVisible] = useState<boolean>(false)
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
        boyCount: res.user_statistics.user_count[1]?.count,
        girlCount: res.user_statistics.user_count[0]?.count,
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
      <div>
        <Head>
          <span style={{ fontSize: 16, fontWeight: 'bold' }}>
            {t('situation.companySurvey')}
          </span>
          <PanelHeaderSecond>
            <div>{userInfo?.company_name}</div>
            <Tooltip placement="top" title={t('container.changeCompany')}>
              <div
                onClick={() => setCompanyModalVisible(true)}
                className={buttonCss}
              >
                <IconFont
                  type="swap"
                  style={{ cursor: 'pointer', fontSize: 14, marginLeft: 8 }}
                />
              </div>
            </Tooltip>
          </PanelHeaderSecond>
        </Head>
        <PermissionWrap
          auth="b/company/statistics"
          hasWidth
          permission={userInfo?.company_permissions}
        >
          <Wrap>
            <Project data={generalData?.project} />
            <Staff data={generalData?.user} />
            <Need data={generalData?.need} />
            <Iteration data={generalData?.iterate} />
          </Wrap>
        </PermissionWrap>

        <CompanyModal
          visible={companyModalVisible}
          onChangeState={() => setCompanyModalVisible(!companyModalVisible)}
        />
      </div>
    )
  }
  return <Loading />
}

export default Situation
