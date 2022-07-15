import styled from '@emotion/styled'
import { Space } from 'antd'
import DemandCard from '@/components/DemandCard'

const Content = styled.div({
  padding: 24,
})

const CardGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 24px',
  background: 'white',
  borderRadius: 6,
})

const Title = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
})

interface Props {
  menu: React.ReactElement
}

const finshEdList = [
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
  { name: '需求标题名称需求标题名称需求标题名称', demand: 5, person: 2 },
]

export default (props: Props) => {
  return (
    <Content>
      <Space size={20}>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => (
            <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />
          ))}
        </CardGroup>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => (
            <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />
          ))}
        </CardGroup>
      </Space>
    </Content>
  )
}
