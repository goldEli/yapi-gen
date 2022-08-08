/* eslint-disable multiline-ternary */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Menu, Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'

const Content = styled.div({
  padding: 24,

  // width: '100%',
  // overflow: 'auto',
})

const DataWrap = styled.div({
  background: 'white',
  overflowX: 'auto',
  height: '100%',
  width: '100%',
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
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  isSpinning?: boolean
}
const DemandGrid = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { projectInfo } = useModel('project')
  const { filterHeight } = useModel('demand')

  const menu = (item: any) => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => props.onChangeVisible(e, item)}>
            {t('common.edit')}
          </div>
        ),
      },
      {
        key: '2',
        label:
          <div onClick={() => props.onDelete(item)}>{t('common.del')}</div>
        ,
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
    <Content style={{ height: `calc(100% - ${filterHeight}px)` }}>
      <DataWrap>
        <Spin spinning={props?.isSpinning}>
          {!!props?.data?.list
            && (props?.data?.list?.length > 0 ? (
              <Space size={20} style={{ alignItems: 'flex-start' }}>
                {props?.data?.list?.map((i: any) => (
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
            )
              : <NoData />
            )}
        </Spin>
      </DataWrap>
    </Content>
  )
}

export default DemandGrid
