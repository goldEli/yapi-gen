/* eslint-disable no-negated-condition */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Menu, Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getIsPermission, openDetail } from '@/tools/index'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'

const Content = styled.div({
  padding: 24,
  overflow: 'auto',
})

const StatusItemsWrap = styled.div({
  width: 316,
  height: '100%',
  background: 'white',
  padding: '0 24px 16px 24px',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
})

const SpaceWrap = styled(Space)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
  '.ant-space-item': {
    height: '100%',
  },
})

const Title = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
  position: 'sticky',
  top: 0,
  background: 'white',
  paddingTop: 16,
  zIndex: 2,
  width: '100%',
})

interface Props {
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  isSpinning?: boolean
  hasId: any
}

const IterationGrid = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { projectInfo } = useModel('project')
  const { filterHeightIterate } = useModel('iterate')
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})

  const getBasicStatus = () => {
    const arr = projectInfo?.filterFelid?.filter(
      (i: any) => i.title === '状态',
    )[0]?.values
    setBasicStatus(arr)
    setDataList(
      arr?.map((i: any) => ({
        list: undefined,
      })),
    )
  }

  useEffect(() => {
    if (props.data?.list) {
      setDataList(
        props.data?.list?.map((i: any) => ({
          list: i.list,
          count: i.count,
          id: i.id,
        })),
      )
    } else {
      getBasicStatus()
    }
  }, [props.data, projectInfo])

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
    openDetail(`/Detail/Demand?type=info&id=${projectId}&demandId=${item.id}`)
  }

  return (
    <Content style={{ height: `calc(100% - ${filterHeightIterate}px)` }}>
      <Spin spinning={props?.isSpinning}>
        <SpaceWrap size={20}>
          {basicStatus?.map((k: any) => (
            <StatusItemsWrap key={k.id}>
              <Title>
                {k.content_txt}(
                {dataList?.filter((item: any) => item.id === k.id)[0]?.count})
              </Title>
              {typeof props?.hasId !== 'object'
                ? <NoData />
               : dataList?.filter((item: any) => item.id === k.id)[0]?.list
                ? dataList?.filter((item: any) => item.id === k.id)[0]?.list
                  .length > 0
                  ? dataList
                    ?.filter((item: any) => item.id === k.id)[0]
                    ?.list?.map((i: any) => (
                      <DemandCard
                        key={i.id}
                        menu={menu(i)}
                        item={i}
                        onClickItem={() => onClickItem(i)}
                      />
                    ))
                 : <NoData />

               : null}
            </StatusItemsWrap>
          ))}
        </SpaceWrap>
      </Spin>
    </Content>
  )
}

export default IterationGrid
