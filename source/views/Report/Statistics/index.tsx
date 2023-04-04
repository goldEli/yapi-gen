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

const StyledWrap = styled.div`
  max-height: 800px;
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

const NameColumn = styled.div`
  display: flex;
  justify-content: start;
`

const Center = styled.div`
  display: flex;
  flex: 7;
`
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

const Statistics = () => {
  const [t] = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)

  const onConfirm = (values: any) => {
    console.log('values', values)
  }
  const columns: ColumnsType<any> = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
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
      width: 150,
    },
    {
      title: '补交',
      dataIndex: 'delayTimes',
      width: 150,
    },
    {
      title: '累计未提交',
      dataIndex: 'totalNoSubmitTimes',
      width: 150,
    },
    {
      title: '当前未提交',
      dataIndex: 'currentNoSubmitTimes',
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
        </CenterRight>
      </Center>
    </StyledWrap>
  )
}

export default Statistics
