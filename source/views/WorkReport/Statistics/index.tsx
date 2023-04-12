import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SecondTitle, SelectWrapBedeck } from '@/components/StyleCommon'
import { css } from '@emotion/css'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/lib/table'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import PaginationBox from '@/components/TablePagination'
import { Space } from 'antd'
import SlideTabs from './SlideTabs'
import PermissionWrap from '@/components/PermissionWrap'
import { useSelector } from '@store/index'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import { getStatTempList } from '@/services/report'

const data: any = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  list: [],
}
for (let i = 0; i < 100; i++) {
  data.list.push({
    id: String(i),
    name: '李钟硕',
    onTimeCount: 146,
    delayTimes: 82,
    totalNoSubmitTimes: 69,
    currentNoSubmitTimes: 17,
  })
}
data.total = data.list.length

const formWorkUsageData: any = {
  list: [],
}
for (let i = 0; i < 100; i++) {
  formWorkUsageData.list.push({
    id: String(i),
    name: '工作日志',
    userCount: 146,
    totalReportCount: 82,
  })
}

const StyledWrap = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  gap: 16px;
`
const Head = styled.div`
  width: calc(100% - 504px);
  box-sizing: border-box;
  padding: 24px;
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
  height: 472px;
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
  const [dataList, setDataList] = useState<any>([])
  const [tabKey, setTabKey] = useState<string>('1')
  const [queryParams, setQueryParams] = useState<any>({})

  const columns: ColumnsType<any> = [
    {
      title: <> {t('common.name')} </>,
      dataIndex: 'name',
      width: 264,
      render: (value: string) => {
        return (
          <NameColumn>
            <CommonUserAvatar size="small" />
            <span>{value} </span>
          </NameColumn>
        )
      },
    },
    {
      title: <> {t('report.statistics.onTime')} </>,
      dataIndex: 'onTimeCount',
      width: 160,
    },
    {
      title: <> {t('report.statistics.supplementary')} </>,
      dataIndex: 'delayTimes',
      width: 160,
    },
    {
      title: <> {t('report.statistics.totalNoSubmitTimes')} </>,
      dataIndex: 'totalNoSubmitTimes',
      width: 160,
    },
    {
      title: <> {t('report.statistics.currentNoSubmitTimes')} </>,

      dataIndex: 'currentNoSubmitTimes',
      width: 160,
    },
  ]

  const usageColumns: ColumnsType<any> = [
    {
      title: <> {t('report.statistics.reportCategory')} </>,
      dataIndex: 'name',
      width: 130,
    },
    {
      title: <> {t('report.statistics.usersVolume')} </>,
      dataIndex: 'userCount',
      width: 88,
    },
    {
      title: <> {t('report.statistics.accumulatedReports')} </>,
      dataIndex: 'totalReportCount',
      width: 88,
    },
  ]

  const getData = async () => {
    const res = await getStatTempList()
    console.log('res')
  }

  useEffect(() => {
    getData()
  }, [queryParams])

  const onChangePage = (current: number, pageSize: number) => {
    setQueryParams({ pageNumber: current, pageSize })
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const items = new Array(30).fill(null).map((_: any, i) => {
    const id = String(i + 1)
    return {
      label: `工作周报${i}`,
      key: id,
    }
  })

  const onChangeDate = (values: any) => {
    const startTime = moment(values[0]).format('YYYY-MM-DD')
    const endTime = moment(values[1]).format('YYYY-MM-DD')
    setQueryParams({ startTime, endTime, pageSize: queryParams.pageSize })
  }

  const handleChange = (value: string) => {
    setTabKey(value)
  }

  return (
    <PermissionWrap
      auth="/Report/Statistics"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <StyledWrap>
        <Head>
          <div className={cardTitle}>
            <SecondTitle>{t('report.statistics.title')}</SecondTitle>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('report.statistics.submitTime')}
              </span>
              <RangePicker isShowQuick onChange={onChangeDate} />
            </SelectWrapBedeck>
          </div>
          <SlideTabs
            items={items}
            defaultValue={tabKey}
            onChange={handleChange}
          />
          <>
            <ResizeTable
              isSpinning={isSpinning}
              dataWrapNormalHeight="calc(100vh - 292px)"
              col={columns}
              dataSource={data.list}
              noData={<NoData />}
            />
            <PaginationBox
              currentPage={data?.currentPage}
              pageSize={data?.pageSize}
              total={data?.total}
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
                  <div>{100}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(67, 186, 154, 0.10)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.onTime')}</span>
                  <div>{100}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(250, 151, 70, 0.1)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.supplementary')}</span>
                  <div>{100}</div>
                </Space>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(255, 92, 94, 0.1)' }}>
                <Space size={8} direction="vertical">
                  <span>{t('report.statistics.unSubmitted')}</span>
                  <div>{0}</div>
                </Space>
              </CardItem>
            </CardGroup>

            <SecondTitle>{t('report.statistics.templateUsage')}</SecondTitle>

            <div className={rightBottom}>
              <ResizeTable
                isSpinning={isSpinning}
                dataWrapNormalHeight="304px"
                col={usageColumns}
                dataSource={formWorkUsageData.list}
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
