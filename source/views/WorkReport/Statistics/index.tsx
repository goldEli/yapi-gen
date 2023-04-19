/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SecondTitle, SelectWrapBedeck } from '@/components/StyleCommon'
import { css } from '@emotion/css'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { useEffect, useMemo, useState } from 'react'
import type { ColumnsType } from 'antd/lib/table'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import PaginationBox from '@/components/TablePagination'
import { Space } from 'antd'
import SlideTabs from './SlideTabs'
import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import {
  getStatInfo,
  getStatTempList,
  getStatUserList,
  getStatTempUsage,
} from '@/services/report'

const StyledWrap = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  gap: 16px;
`
const Head = styled.div`
  width: calc(100% - 504px);
  box-sizing: border-box;
  padding: 24px 24px 0 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  flex: 1;
`
const Center = styled.div`
  width: 488px;
  border-left: 1px solid #ecedef;
`
const NameColumn = styled.div({
  display: 'flex',
  justifyContent: 'start',
  span: {
    marginLeft: '8px',
  },
})

const CenterRight = styled.div`
  box-sizing: border-box;
  padding: 24px 0 24px 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
`

const cardTitle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const rightBottom = css`
  margin: 8px 0;
`
const CardGroup = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '16px 0 48px',
})

const CardItem = styled.div({
  height: 104,
  width: 208,
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  borderRadius: 16,
  span: {
    fontSize: 12,
    color: 'var(--neutral-n2)',
  },
  div: {
    fontSize: 24,
    color: 'var(--neutral-n1-d1)',
    fontFamily: 'SiYuanMedium',
    lineHeight: '28px',
  },
})
const Statistics = () => {
  const [t] = useTranslation()
  const { currentMenu } = useSelector(store => store.user)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [formWorkData, setFormWorkData] = useState<any[]>([])
  const [userListData, setUserListData] = useState<any>({})
  const [usageDataList, setUsageDataList] = useState<any[]>([])
  const [statInfoData, setStatInfoData] = useState<any>({})
  const [tabKey, setTabKey] = useState<string | number>('')
  const [queryParams, setQueryParams] = useState<any>({})

  const columns: ColumnsType<any> = [
    {
      title: <> {t('common.name')} </>,
      // 汇报对象id
      dataIndex: 'report_to_user_id',
      width: 264,
      render: (value: string) => {
        return (
          <NameColumn>
            <CommonUserAvatar size="small" />
            <span>{value}</span>
          </NameColumn>
        )
      },
    },
    {
      title: <>{t('report.statistics.onTime')}</>,
      dataIndex: 'on_time_count',
      width: 160,
    },
    {
      title: <>{t('report.statistics.supplementary')}</>,
      dataIndex: 'no_payment_count',
      width: 160,
    },
    {
      title: <>{t('report.statistics.totalNoSubmitTimes')}</>,
      dataIndex: 'cumulative_unsubmit_count',
      width: 160,
    },
    {
      title: <>{t('report.statistics.currentNoSubmitTimes')}</>,
      dataIndex: 'no_submit_count',
      width: 160,
    },
  ]

  const usageColumns: ColumnsType<any> = [
    {
      title: <>{t('report.statistics.reportCategory')}</>,
      dataIndex: 'name',
      width: 130,
    },
    {
      title: <>{t('report.statistics.usersVolume')}</>,
      dataIndex: 'uv',
      width: 88,
    },
    {
      title: <>{t('report.statistics.accumulatedReports')}</>,
      dataIndex: 'pv',
      width: 88,
    },
  ]

  const getTempList = async () => {
    const { list } = await getStatTempList()
    const items = Object.values(list).map((v: any) => {
      return {
        label: v.name,
        key: v.id,
      }
    })
    setFormWorkData(items)
    setTabKey(list[0].id)
  }

  const getUsageDataList = async () => {
    const { list } = await getStatTempUsage()
    setUsageDataList(list)
  }

  const getUserList = async () => {
    setIsSpinning(true)
    const response = await getStatUserList({
      report_template_id: tabKey,
      ...queryParams,
    })
    setUserListData(response)
    setIsSpinning(false)
  }

  const getStatInfoData = async () => {
    const statData = await getStatInfo()
    setStatInfoData(statData)
  }

  useEffect(() => {
    getTempList()
    getUsageDataList()
    getStatInfoData()
  }, [])

  useEffect(() => {
    if (tabKey) {
      getUserList()
    }
  }, [tabKey, queryParams])

  const onChangePage = (current: number, pageSize: number) => {
    setQueryParams({ page: current, pageSize })
  }

  // const onChangeDate = (values: any) => {
  //   const startTime = values ? moment(values[0]).format('YYYY-MM-DD') : null
  //   const endTime = values ? moment(values[1]).format('YYYY-MM-DD') : null
  //   setQueryParams({ startTime, endTime, pageSize: queryParams.pageSize })
  // }

  const onTabChange = (value: string) => {
    setTabKey(value)
  }

  // const submitDate = useMemo(() => {
  //   if (queryParams.startTime && queryParams.endTime) {
  //     return [moment(queryParams.startTime), moment(queryParams.endTime)]
  //   }
  //   return null
  // }, [queryParams])

  return (
    <PermissionWrap
      auth="/Report/Statistics"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <StyledWrap>
        <Head>
          <div className={cardTitle}>
            <SecondTitle>{t('report.statistics.title')}</SecondTitle>
            {/* <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('report.statistics.submitTime')}
              </span>
              <RangePicker
                isShowQuick
                dateValue={submitDate}
                onChange={onChangeDate}
              />
            </SelectWrapBedeck> */}
          </div>
          <SlideTabs
            activeKey={tabKey}
            items={formWorkData}
            onChange={onTabChange}
          />
          <>
            <ResizeTable
              isSpinning={isSpinning}
              dataWrapNormalHeight="calc(100vh - 292px)"
              col={columns}
              dataSource={userListData.list}
              noData={<NoData />}
            />
            <PaginationBox
              currentPage={queryParams?.page}
              pageSize={queryParams?.pageSize}
              total={userListData.total}
              onChange={onChangePage}
            />
          </>
        </Head>
        <Center>
          <CenterRight>
            <SecondTitle>{t('report.statistics.mine')}</SecondTitle>
            <CardGroup size={24}>
              <CardItem style={{ backgroundColor: 'rgba(102, 136, 255, 0.1)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.accumulated')}</span>
                  <div>{statInfoData.accruing}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(67, 186, 154, 0.10)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.onTime')}</span>
                  <div>{statInfoData.on_time_count}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(250, 151, 70, 0.1)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.supplementary')}</span>
                  <div>{statInfoData.no_payment_count}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(255, 92, 94, 0.1)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.unSubmitted')}</span>
                  <div>{statInfoData.cumulative_unsubmit_count}</div>
                </Space>
              </CardItem>
            </CardGroup>

            <SecondTitle>{t('report.statistics.templateUsage')}</SecondTitle>

            <div className={rightBottom}>
              <ResizeTable
                isSpinning={false}
                dataWrapNormalHeight="304px"
                col={usageColumns}
                dataSource={usageDataList}
                noData={<NoData />}
              />
            </div>
          </CenterRight>
        </Center>
      </StyledWrap>
    </PermissionWrap>
  )
}

export default Statistics
