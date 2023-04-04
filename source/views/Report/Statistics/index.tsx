import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SecondTitle, SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import { css } from '@emotion/css'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'
import { useState } from 'react'
import { ColumnsType } from 'antd/lib/table'

const StyledWrap = styled.div`
  height: 400px;
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
const data: any[] = []
for (let i = 0; i < 100; i++) {
  data.push({
    name: '李钟硕',
    onTimeCount: 146,
    delayTimes: 82,
    totalNoSubmitTimes: 69,
    currentNoSubmitTimes: 17,
  })
}

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
          dataSource={data}
          noData={<NoData />}
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
