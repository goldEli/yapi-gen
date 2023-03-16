/* eslint-disable camelcase */
// 需求主页-需求看板模式

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools/index'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { useSelector } from '@store/index'
import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'
import NewLoadingTransition from '../NewLoadingTransition'

const Content = styled.div({
  height: 'calc(100% - 32px)',
  padding: '20px 0',
})

const DataWrap = styled.div({
  overflowX: 'auto',
  height: '100%',
  width: '100%',
})

const StatusItemsWrap = styled.div({
  width: 302,
  height: '100%',
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    display: 'none',
  },
})

const Title = styled.div<{ state?: number }>(
  {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font14)',
    color: 'var(--neutral-n1-d1)',
    div: {
      width: 8,
      height: 8,
      borderRadius: 2,
      marginRight: 8,
    },
  },
  ({ state }) => ({
    div: {
      background:
        state === 1
          ? 'var(--auxiliary-b1)'
          : state === 2
          ? 'var(--neutral-n7)'
          : state === 3
          ? 'var(--function-success)'
          : '',
    },
  }),
)

const SpaceWrap = styled(Space)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
  '.ant-space-item': {
    height: '100%',
  },
})

const CardGroup = styled.div`
  width: 100%;
  padding: 16px;
  background: var(--neutral-n9);
  height: calc(100% - 48px);
  overflow: auto;
`

interface Props {
  data: any
  onChangeVisible(item: any): void
  onDelete(item: any): void
  isSpinning?: boolean
  onUpdate(state: any): void
}
const DemandGrid = (props: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfoValues } = useSelector(store => store.project)
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})
  const [openDemandDetail] = useOpenDemandDetail()

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
          isStart: i.isStart,
          isEnd: i.isEnd,
        })),
      )
    }
  }, [props.data])

  const onClickItem = (item: any, list: any) => {
    const demandIds = list?.map((i: any) => i.id)
    openDemandDetail({ ...item, ...{ demandIds } }, projectId, item.id)
  }

  const getColor = (id: any) => {
    const current = dataList?.filter((item: any) => item.id === id)[0]
    return current?.isStart === 1 && current?.isEnd === 2
      ? 1
      : current?.isEnd === 1 && current?.isStart === 2
      ? 2
      : 3
  }

  return (
    <Content>
      <DataWrap>
        <Spin indicator={<NewLoadingTransition />} spinning={props?.isSpinning}>
          <SpaceWrap size={20}>
            {basicStatus?.map((k: any) => (
              <StatusItemsWrap key={k.id}>
                <Title state={getColor(k.id)}>
                  <div />
                  {k.content_txt}(
                  {dataList?.filter((item: any) => item.id === k.id)[0]?.count})
                </Title>
                <CardGroup>
                  {!!dataList?.filter((item: any) => item.id === k.id)[0]
                    ?.list &&
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
                            onClickItem={() =>
                              onClickItem(
                                i,
                                dataList?.filter(
                                  (item: any) => item.id === k.id,
                                )[0]?.list,
                              )
                            }
                            indexVal={idx}
                            onUpdate={() => props?.onUpdate(true)}
                          />
                        ))
                    ) : (
                      <NoData />
                    ))}
                </CardGroup>
              </StatusItemsWrap>
            ))}
          </SpaceWrap>
        </Spin>
      </DataWrap>
    </Content>
  )
}

export default DemandGrid
