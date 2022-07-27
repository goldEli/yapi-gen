/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
  list: any[]
}
const DemandGrid = (props: Props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }
  return (
    <Content>
      <Space size={20}>
        {props.list?.map((i: any) => (
          <CardGroup key={i.name}>
            <Title>
              {i.name}({i.count})
            </Title>
            {i.list?.map((k: any) => (
              <DemandCard
                key={k.id}
                menu={props.menu}
                item={k}
                onClickItem={() => onClickItem(k)}
              />
            ))}
          </CardGroup>
        ))}
      </Space>
    </Content>
  )
}

export default DemandGrid
