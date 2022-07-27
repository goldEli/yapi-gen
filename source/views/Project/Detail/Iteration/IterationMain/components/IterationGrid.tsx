/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space } from 'antd'
import DemandCard from '@/components/DemandCard'
import projectImg from '@/assets/projectImg.png'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
  {
    name: '需求标题名称需求标题名称需求标题名称',
    demand: 5,
    person: [{ name: '张三', avatar: '' }],
  },
]

const IterationGrid = (props: Props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }
  return (
    <Content>
      <Space size={20}>
        <CardGroup>
          <Title>规划中(8)</Title>
          {finshEdList.map((i: any) => (
            <DemandCard
              menu={props.menu}
              key={i.id}
              item={i}
              onClickItem={() => onClickItem(i)}
            />
          ))}
        </CardGroup>
      </Space>
    </Content>
  )
}

export default IterationGrid
