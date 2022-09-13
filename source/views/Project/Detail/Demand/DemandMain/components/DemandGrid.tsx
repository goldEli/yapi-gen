/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Menu, Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { getIsPermission, getParamsData, openDetail } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { encryptPhp } from '@/tools/cryptoPhp'

const Content = styled.div({
  padding: 24,
})

const DataWrap = styled.div({
  overflowX: 'auto',
  height: '100%',
  width: '100%',
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
  '::-webkit-scrollbar': {
    display: 'none',
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

const SpaceWrap = styled(Space)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
  '.ant-space-item': {
    height: '100%',
  },
})

interface Props {
  data: any
  onChangeVisible(e: any, item: any): void
  onDelete(item: any): void
  isSpinning?: boolean
}
const DemandGrid = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useModel('project')
  const { filterHeight } = useModel('demand')
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})

  useEffect(() => {
    const arr = projectInfo?.filterFelid?.filter(
      (i: any) => i.title === '状态',
    )[0]?.values
    setBasicStatus(arr)
    setDataList(
      arr?.map((i: any) => ({
        list: undefined,
      })),
    )
  }, [])

  useEffect(() => {
    if (props.data?.list) {
      setDataList(
        props.data?.list?.map((i: any) => ({
          list: i.list,
          count: i.count,
          id: i.id,
        })),
      )
    }
  }, [props.data])

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
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

  return (
    <Content style={{ height: `calc(100% - ${filterHeight}px)` }}>
      <DataWrap>
        <Spin spinning={props?.isSpinning}>
          <SpaceWrap size={20}>
            {basicStatus?.map((k: any) => (
              <StatusItemsWrap key={k.id}>
                <Title>
                  {k.content_txt}(
                  {dataList?.filter((item: any) => item.id === k.id)[0]?.count})
                </Title>
                {!!dataList?.filter((item: any) => item.id === k.id)[0]?.list
                  && (dataList?.filter((item: any) => item.id === k.id)[0]?.list
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
                  )}
              </StatusItemsWrap>
            ))}
          </SpaceWrap>
        </Spin>
      </DataWrap>
    </Content>
  )
}

export default DemandGrid
