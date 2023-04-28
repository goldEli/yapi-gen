// 迭代-看板模式

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData } from '@/tools/index'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import useOpenDemandDetail from '@/hooks/useOpenDemandDeatil'
import { setFilterParamsModal } from '@store/project'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import CreateDemandButton from './CreateDemandButton'
import NewLoadingTransition from '@/components/NewLoadingTransition'

const Content = styled.div({
  paddingBottom: 24,
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

const SpaceWrap = styled(Space)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
  '.ant-space-item': {
    height: '100%',
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
  hasId: any
  onUpdate(): void
  iterateId: any
}

const IterationGrid = (props: Props) => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfoValues, projectInfo } = useSelector(store => store.project)
  const [basicStatus, setBasicStatus] = useState<any>([])
  const [dataList, setDataList] = useState<any>({})
  const [openDemandDetail] = useOpenDemandDetail()
  const { filterParams } = useSelector(store => store.iterate)

  const hasCreate =
    !getIsPermission(projectInfo?.projectPermissions, 'b/story/save') &&
    props.hasId &&
    props.hasId?.status === 1 &&
    projectInfo?.status === 1

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

  const onCreateDemand = () => {
    dispatch(setFilterParamsModal(filterParams))
    dispatch(setIsCreateDemandVisible(true))
    dispatch(setCreateDemandProps({ projectId, iterateId: props.iterateId }))
  }

  return (
    <>
      <CreateDemandButton
        hasCreate={hasCreate}
        onCreateDemand={onCreateDemand}
      />
      <Content
        style={{
          height: hasCreate ? 'calc(100% - 96px)' : 'calc(100% - 32px)',
        }}
      >
        <div style={{ height: '100%', overflow: 'auto' }}>
          <Spin
            indicator={<NewLoadingTransition />}
            spinning={props?.isSpinning}
          >
            <SpaceWrap size={20}>
              {basicStatus?.map((k: any) => (
                <StatusItemsWrap key={k.id}>
                  <Title state={getColor(k.id)}>
                    <div />
                    {k.content_txt}(
                    {
                      dataList?.filter((item: any) => item.id === k.id)[0]
                        ?.count
                    }
                    )
                  </Title>
                  <CardGroup>
                    {typeof props?.hasId === 'object' ? (
                      dataList?.filter((item: any) => item.id === k.id)[0]
                        ?.list ? (
                        dataList?.filter((item: any) => item.id === k.id)[0]
                          ?.list.length > 0 ? (
                          dataList
                            ?.filter((item: any) => item.id === k.id)[0]
                            ?.list?.map((i: any, idx: any) => (
                              <DemandCard
                                key={i.id}
                                item={i}
                                indexVal={idx}
                                onClickItem={() =>
                                  onClickItem(
                                    i,
                                    dataList?.filter(
                                      (item: any) => item.id === k.id,
                                    )[0]?.list,
                                  )
                                }
                                onChangeDelete={props?.onDelete}
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
                  </CardGroup>
                </StatusItemsWrap>
              ))}
            </SpaceWrap>
          </Spin>
        </div>
      </Content>
    </>
  )
}

export default IterationGrid
