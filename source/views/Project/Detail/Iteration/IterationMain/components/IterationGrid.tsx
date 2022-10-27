/* eslint-disable no-negated-condition */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled'
import { Space, Spin } from 'antd'
import DemandCard from '@/components/DemandCard'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, openDetail } from '@/tools/index'
import { useModel } from '@/models'
import NoData from '@/components/NoData'
import { useEffect, useState } from 'react'
import { encryptPhp } from '@/tools/cryptoPhp'

const Content = styled.div({
  padding: 16,
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
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
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

  const onClickItem = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({ type: 'info', id: projectId, demandId: item.id }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
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
              {typeof props?.hasId !== 'object' ? (
                <NoData />
              ) : dataList?.filter((item: any) => item.id === k.id)[0]?.list ? (
                dataList?.filter((item: any) => item.id === k.id)[0]?.list
                  .length > 0 ? (
                  dataList
                    ?.filter((item: any) => item.id === k.id)[0]
                    ?.list?.map((i: any) => (
                      <DemandCard
                        key={i.id}
                        item={i}
                        onClickItem={() => onClickItem(i)}
                        onChangeDelete={props?.onDelete}
                        onChangeEdit={props?.onChangeVisible}
                      />
                    ))
                ) : (
                  <NoData />
                )
              ) : null}
            </StatusItemsWrap>
          ))}
        </SpaceWrap>
      </Spin>
    </Content>
  )
}

export default IterationGrid
