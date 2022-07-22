/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space } from 'antd'
import DemandCard from '@/components/DemandCard'
import projectImg from '@/assets/projectImg.png'

const Content = styled.div({
  padding: 24,

  // width: '100%',
  // overflowY: 'auto',
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
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [
      { name: '张三', avatar: '' },
      { name: '张三', avatar: '' },
      { name: '张三', avatar: projectImg },
      { name: '张三', avatar: '' },
      { name: '张三', avatar: projectImg },
    ],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [
      { name: '张三', avatar: projectImg },
      { name: '张三', avatar: '' },
      { name: '张三', avatar: projectImg },
    ],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [
      { name: '张三', avatar: projectImg },
      { name: '张三', avatar: '' },
      { name: '张三', avatar: projectImg },
    ],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
]

const DemandGrid = (props: Props) => {
  return (
    <Content>
      <Space size={20}>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />)}
        </CardGroup>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />)}
        </CardGroup>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />)}
        </CardGroup>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i, idx) => <DemandCard menu={props.menu} key={`${i.demand}_${idx}`} item={i} />)}
        </CardGroup>
      </Space>
    </Content>
  )
}

export default DemandGrid
