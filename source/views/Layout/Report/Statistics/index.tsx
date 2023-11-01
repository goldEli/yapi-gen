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
import { Space, Spin } from 'antd'
import SlideTabs from './SlideTabs'
import {
  getStatInfo,
  getStatTempList,
  getStatUserList,
  getStatTempUsage,
} from '@/services/report'
import NewLoadingTransition from '@/components/NewLoadingTransition'

const StyledWrap = styled.div`
  height: calc(100vh - 56px);
  display: flex;
`
const Head = styled.div`
  width: calc(100% - 504px);
  box-sizing: border-box;
  padding: 24px 24px 0 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  flex: 1;
  .pagination-box {
    padding-right: 0 !important;
  }
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
  margin: 8px 24px 0 0;
`
const CardGroup = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '16px 0 48px',
})

const spinWrap = css`
  .ant-spin.ant-spin-spinning {
    top: 30%;
  }
`

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
  const [spinning, setSpinning] = useState<boolean>(false)
  const [tabItems, setTabItems] = useState<any[]>([])
  const [userListData, setUserListData] = useState<any>({})
  const [usageDataList, setUsageDataList] = useState<any[]>([])
  const [statInfoData, setStatInfoData] = useState<any>({})
  const [tabKey, setTabKey] = useState<string | number>('-1')
  const [queryParams, setQueryParams] = useState<any>({})

  const columns: ColumnsType<any> = [
    {
      title: <> {t('common.name')} </>,
      dataIndex: 'user',
      width: 260,
      render: (value: any) => {
        return (
          <NameColumn>
            <CommonUserAvatar size="small" />
            <span>{value.name}</span>
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
      align: 'left',
      width: 88,
    },
    {
      title: <>{t('report.statistics.accumulatedReports')}</>,
      dataIndex: 'pv',
      width: 88,
    },
  ]

  const getTempList = async () => {
    setSpinning(true)
    const { list } = await getStatTempList()
    const items = Object.values(list).map((v: any) => {
      return {
        label: v.name,
        key: v.id,
      }
    })
    setSpinning(false)
    setTabItems([
      { label: String(t('report.statistics.allReport')), key: '-1' },
      ...items,
    ])
  }

  const getUsageDataList = async () => {
    const { list } = await getStatTempUsage()
    setUsageDataList(list)
  }

  const getUserList = async () => {
    const response = await getStatUserList({
      report_template_id: tabKey === '-1' ? void 0 : tabKey,
      ...queryParams,
    })
    setUserListData(response)
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

  const onTabChange = (value: string) => {
    setTabKey(value)
  }

  return (
    <div className={spinWrap}>
      <Spin indicator={<NewLoadingTransition />} spinning={spinning}>
        <StyledWrap>
          <Head>
            <div className={cardTitle}>
              <SecondTitle>{t('report.statistics.title')}</SecondTitle>
            </div>
            {tabItems.length > 0 && (
              <SlideTabs
                activeKey={tabKey}
                items={tabItems}
                onChange={onTabChange}
              />
            )}

            <>
              <ResizeTable
                isSpinning={false}
                dataWrapNormalHeight="100%"
                col={columns}
                dataSource={userListData.list}
                noData={<NoData />}
              />
              <PaginationBox
                currentPage={queryParams?.page}
                pageSize={queryParams?.pageSize}
                total={userListData?.pager?.total}
                onChange={onChangePage}
              />
            </>
          </Head>

          <Center>
            <CenterRight>
              <SecondTitle>{t('report.statistics.mine')}</SecondTitle>
              <CardGroup size={24}>
                <CardItem
                  style={{ backgroundColor: 'rgba(102, 136, 255, 0.1)' }}
                >
                  <span style={{ marginBottom: 9 }}>
                    {t('report.statistics.accumulated')}
                  </span>
                  <div>{statInfoData.accruing}</div>
                </CardItem>
                <CardItem
                  style={{ backgroundColor: 'rgba(67, 186, 154, 0.10)' }}
                >
                  <span style={{ marginBottom: 9 }}>
                    {t('report.statistics.onTime')}
                  </span>
                  <div>{statInfoData.on_time_count}</div>
                </CardItem>
                <CardItem
                  style={{ backgroundColor: 'rgba(250, 151, 70, 0.1)' }}
                >
                  <span style={{ marginBottom: 9 }}>
                    {t('report.statistics.supplementary')}
                  </span>
                  <div>{statInfoData.no_payment_count}</div>
                </CardItem>
                <CardItem style={{ backgroundColor: 'rgba(255, 92, 94, 0.1)' }}>
                  <span style={{ marginBottom: 9 }}>
                    {t('report.statistics.unSubmitted')}
                  </span>
                  <div>{statInfoData.cumulative_unsubmit_count}</div>
                </CardItem>
              </CardGroup>

              <SecondTitle>{t('report.statistics.templateUsage')}</SecondTitle>

              <div className={rightBottom}>
                <ResizeTable
                  isSpinning={false}
                  dataWrapNormalHeight="calc(100vh - 450px)"
                  col={usageColumns}
                  dataSource={usageDataList}
                  noData={<NoData />}
                />
              </div>
            </CenterRight>
          </Center>
        </StyledWrap>
      </Spin>
    </div>
  )
}

export default Statistics
