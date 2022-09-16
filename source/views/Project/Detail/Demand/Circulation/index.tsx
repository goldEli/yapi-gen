/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Timeline } from 'antd'
import { NameWrap, ViewWrap } from '@/components/StyleCommon'

const TimeLIneWrap = styled(Timeline)({
  marginTop: 24,
  '.ant-timeline-item-label': {
    width: '102px!important',
  },
  '.ant-timeline-item-tail,.ant-timeline-item-head': {
    left: '120px!important',
  },
  '.ant-timeline-item-content': {
    borderRadius: 6,
    padding: '16px 24px',
    left: '125px!important',
    width: 'calc(100% - 151px)!important',
    background: '#F8F9FA',
  },
})

const Wrap = styled.div({
  height: 'calc(100% - 50px)',
  background: 'white',
  overflowX: 'auto',
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  padding: '0 32px',
})

const TimeItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 400,
  'span:first-child': {
    fontSize: 16,
    color: '#323233',
  },
  'span:last-child': {
    color: '#646566',
    fontSize: 12,
  },
})

const LineItem = styled.div<{
  top?: number
  bottom?: number
  hasTop?: boolean
}>(
  {
    display: 'flex',
  },
  ({ top, bottom, hasTop }) => ({
    marginTop: top || 0,
    marginBottom: bottom || 0,
    alignItems: hasTop ? 'flex-start' : 'center',
  }),
)

const LabelItem = styled.div({
  color: '#969799',
  fontSize: 14,
  fontWeight: 400,
  width: 70,
})

const TextWrap = styled.div({
  fontSize: 16,
  fontWeight: 400,
  color: '#323233',
})

const ContentWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: '#323233',
  width: 'calc(100% - 70px)',
})

const Circulation = () => {
  return (
    <Wrap>
      <TimeLIneWrap mode="left">
        <Timeline.Item
          label={
            <TimeItem>
              <span>2015-09-01</span>
              <span>09:12:11</span>
            </TimeItem>
          }
        >
          <LineItem bottom={8}>
            <NameWrap style={{ marginBottom: 0, width: 24, height: 24 }}>
              张
            </NameWrap>
            <TextWrap style={{ marginLeft: 8 }}>张三</TextWrap>
            <TextWrap style={{ marginLeft: 32 }}>创建需求</TextWrap>
            <ViewWrap style={{ marginLeft: 8 }} color="#FA9746">
              规划中
            </ViewWrap>
          </LineItem>

          <LineItem top={16} hasTop>
            <LabelItem>处理人:</LabelItem>
            <ContentWrap>咯某某</ContentWrap>
          </LineItem>
          <LineItem top={16} hasTop>
            <LabelItem>意见:</LabelItem>
            <ContentWrap>
              111111111111112112222222222222222222222222222
            </ContentWrap>
          </LineItem>
        </Timeline.Item>
        <Timeline.Item
          label={
            <TimeItem>
              <span>2015-09-01</span>
              <span>09:12:11</span>
            </TimeItem>
          }
        >
          Solve initial network problems
        </Timeline.Item>
      </TimeLIneWrap>
    </Wrap>
  )
}

export default Circulation
