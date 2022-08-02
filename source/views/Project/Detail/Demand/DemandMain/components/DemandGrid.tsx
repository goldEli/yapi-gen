/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Menu, Space } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'

const Content = styled.div({
  padding: 24,

  // width: '100%',
  // overflow: 'auto',
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
const DemandGrid = (props: Props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { projectInfo } = useModel('project')

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: <div onClick={e => props.onChangeVisible(e, item)}>编辑</div>,
      },
      {
        key: '2',
        label: <div onClick={() => props.onDelete(item)}>删除</div>,
      },
    ]

    if (getIsPermission(projectInfo?.projectPermissions, 'b/story/update')) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (getIsPermission(projectInfo?.projectPermissions, 'b/story/delete')) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

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

export default DemandGrid
