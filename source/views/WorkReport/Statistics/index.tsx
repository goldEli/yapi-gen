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
import { use } from 'i18next'
import moment from 'moment'

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
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  borderRadius: 6,
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
      title: '姓名',
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
      title: '按时提交',
      dataIndex: 'onTimeCount',
      width: 160,
    },
    {
      title: '补交',
      dataIndex: 'delayTimes',
      width: 160,
    },
    {
      title: '累计未提交',
      dataIndex: 'totalNoSubmitTimes',
      width: 160,
    },
    {
      title: '当前未提交',
      dataIndex: 'currentNoSubmitTimes',
      width: 160,
    },
  ]

  const usageColumns: ColumnsType<any> = [
    {
      title: '汇报类别',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '使用人数',
      dataIndex: 'userCount',
      width: 150,
    },
    {
      title: '累计汇报数',
      dataIndex: 'totalReportCount',
      width: 150,
    },
  ]

  const getData = () => {
    console.log('getData')
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
      children: (
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
      ),
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
            <SecondTitle>{t('report.statistics')}</SecondTitle>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                提交时间
              </span>
              <RangePicker isShowQuick onChange={onChangeDate} />
            </SelectWrapBedeck>
          </div>
          <SlideTabs
            items={items}
            defaultValue={tabKey}
            onChange={handleChange}
          />
        </Head>
        <Center>
          <CenterRight>
            <SecondTitle>{t('report.mine')}</SecondTitle>
            <CardGroup size={24}>
              <CardItem style={{ backgroundColor: 'rgba(102, 136, 255, 0.1)' }}>
                <span>累计汇报</span>
                <div>{100}</div>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(67, 186, 154, 0.10)' }}>
                <span>按时汇报</span>
                <div>{100}</div>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(250, 151, 70, 0.1)' }}>
                <span>补交</span>
                <div>{0}</div>
              </CardItem>
              <CardItem style={{ backgroundColor: 'rgba(255, 92, 94, 0.1)' }}>
                <span>未提交</span>
                <div>{0}</div>
              </CardItem>
            </CardGroup>

            <SecondTitle>汇报模版使用情况</SecondTitle>

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
