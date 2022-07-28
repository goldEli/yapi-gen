/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Menu, Space } from 'antd'
import DemandCard from '@/components/DemandCard'
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
  list: any[]
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
}

const IterationGrid = (props: Props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => props.onChangeVisible(e, item)}>编辑</div>,
        },
        {
          key: '2',
          label: <div onClick={() => props.onDelete(item)}>删除</div>,
        },
      ]}
    />
  )

  const onClickItem = (item: any) => {
    navigate(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }
  return (
    <Content>
      <Space size={20} style={{ alignItems: 'flex-start' }}>
        {props.list?.map((i: any) => (
          <CardGroup key={i.name}>
            <Title>
              {i.name}({i.count})
            </Title>
            {i.list?.map((k: any) => (
              <DemandCard
                key={k.id}
                menu={menu(k)}
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

export default IterationGrid
