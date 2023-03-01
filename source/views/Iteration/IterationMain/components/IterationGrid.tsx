// 迭代-看板模式

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, openDetail } from '@/tools/index'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'

const Content = styled.div({
  padding: 16,
  height: 'calc(100% - 32px)',
})

const StatusItemsWrap = styled.div({
  width: 316,
  height: '100%',
  background: 'white',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    display: 'none',
  },
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
  zIndex: 6,
  width: '100%',
})

interface Props {
  data: any
  onChangeVisible(item: any): void
  onDelete(item: any): void
  isSpinning?: boolean
  hasId: any
  onUpdate(): void
}

const IterationGrid = (props: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfoValues } = useSelector(store => store.project)
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})

  const getBasicStatus = () => {
    const arr = projectInfoValues
      ?.filter((i: any) => i.key === 'status')[0]
      ?.children?.filter((k: any) => k.id !== -1)
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
  }, [props.data, projectInfoValues])

  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/ProjectManagement/Demand?data=${params}`)
  }

  return (
    <Content>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <Spin spinning={props?.isSpinning}>
          <SpaceWrap size={20}>
            {basicStatus?.map((k: any) => (
              <StatusItemsWrap key={k.id}>
                <Title>
                  {k.content_txt}(
                  {dataList?.filter((item: any) => item.id === k.id)[0]?.count})
                </Title>
                {typeof props?.hasId === 'object' ? (
                  dataList?.filter((item: any) => item.id === k.id)[0]?.list ? (
                    dataList?.filter((item: any) => item.id === k.id)[0]?.list
                      .length > 0 ? (
                      dataList
                        ?.filter((item: any) => item.id === k.id)[0]
                        ?.list?.map((i: any, idx: any) => (
                          <DemandCard
                            key={i.id}
                            item={i}
                            indexVal={idx}
                            onClickItem={() => onClickItem(i)}
                            onChangeDelete={props?.onDelete}
                            onChangeEdit={props?.onChangeVisible}
                            onUpdate={props?.onUpdate}
                          />
                        ))
                    ) : (
                      <NoData />
                    )
                  ) : null
                ) : (
                  <NoData />
                )}
              </StatusItemsWrap>
            ))}
          </SpaceWrap>
        </Spin>
      </div>
    </Content>
  )
}

export default IterationGrid
