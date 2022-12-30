// 需求主页-需求看板模式

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { getParamsData, openDetail } from '@/tools/index'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { encryptPhp } from '@/tools/cryptoPhp'

const Content = styled.div({
  padding: 16,
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
  zIndex: 4,
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
  onUpdate(state: any): void
}
const DemandGrid = (props: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfoValues } = useModel('project')
  const { filterHeight } = useModel('demand')
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})

  useEffect(() => {
    const arr = projectInfoValues
      ?.filter((i: any) => i.key === 'status')[0]
      ?.children?.filter((k: any) => k.id !== -1)
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
                {!!dataList?.filter((item: any) => item.id === k.id)[0]?.list &&
                  (dataList?.filter((item: any) => item.id === k.id)[0]?.list
                    .length > 0 ? (
                    dataList
                      ?.filter((item: any) => item.id === k.id)[0]
                      ?.list?.map((i: any, idx: any) => (
                        <DemandCard
                          key={i.id}
                          onChangeDelete={props?.onDelete}
                          onChangeEdit={props?.onChangeVisible}
                          item={i}
                          onClickItem={() => onClickItem(i)}
                          indexVal={idx}
                          onUpdate={() => props?.onUpdate(true)}
                        />
                      ))
                  ) : (
                    <NoData />
                  ))}
              </StatusItemsWrap>
            ))}
          </SpaceWrap>
        </Spin>
      </DataWrap>
    </Content>
  )
}

export default DemandGrid
