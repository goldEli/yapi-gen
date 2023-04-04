import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { SecondTitle, SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import { css } from '@emotion/css'

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
const Statistics = () => {
  const [t] = useTranslation()

  const onConfirm = (values: any) => {
    console.log('values', values)
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
