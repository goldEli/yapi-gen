import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SecondTitle, SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import { css } from '@emotion/css'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { useState } from 'react'
import type { ColumnsType } from 'antd/lib/table'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import PaginationBox from '@/components/TablePagination'
import { Space } from 'antd'

const data: any = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  list: [],
}
for (let i = 0; i < 100; i++) {
  data.list.push({
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
    name: '工作日志',
    userCount: 146,
    totalReportCount: 82,
  })
}

const StyledWrap = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  gap: 17px;
`
const Head = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  flex: 8;
`
const Center = styled.div`
  display: flex;
  flex: 2;
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
  padding: 24px;
  flex: 1;
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
  background: 'var(--hover-d2)',
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
  const [isSpinning, setIsSpinning] = useState(false)

  const onConfirm = (values: any) => {
    console.log('values', values)
    setIsSpinning(true)
  }
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

  const onChangePage = (page: any, size: any) => {
    console.log('onChangePage', page, size)
  }

  return (
    <StyledWrap>
      <Head>
        <div className={cardTitle}>
          <SecondTitle>{t('report.statistics')}</SecondTitle>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>提交时间</span>
            <RangePicker isShowQuick onChange={onConfirm} />
          </SelectWrapBedeck>
        </div>
        <ResizeTable
          isSpinning={isSpinning}
          dataWrapNormalHeight="calc(100% - 92px)"
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
      </Head>
      <Center>
        <CenterRight>
          <SecondTitle>{t('report.mine')}</SecondTitle>
          <CardGroup size={24}>
            <CardItem>
              <span>{t('common.demand')}</span>
              <div>{100}</div>
            </CardItem>
            <CardItem>
              <span>{t('project.iterateEdition')}</span>
              <div>{100}</div>
            </CardItem>
            <CardItem>
              <span>{t('project.projectMember')}</span>
              <div>{0}</div>
            </CardItem>
            <CardItem>
              <span>{t('project.projectMember')}</span>
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
  )
}

export default Statistics
