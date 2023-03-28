// 他的模块所有页面公用布局

/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react'
import CommonNeed from './CommonNeed'
import MineSwiper from '../components/MineSwiper'
import Loading from '@/components/Loading'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { getUserInfoProject } from '@/services/memberInfo'

const MainWrap = styled.div({
  height: 'calc(100% - 124px)',
  overflow: 'auto',
})

const Title = styled.div`
  height: 32px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  line-height: 32px;
  margin: 20px 16px;
  margin-bottom: 0px;
`

interface Props {
  title: any
  type: any
  subTitle: any
}

const MainIndex = (props: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { isMember, userId } = paramsData
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(paramsData.id || 0)
  const [loadingState, setLoadingState] = useState<boolean>(false)

  const init = async () => {
    const res = await getUserInfoProject({
      type: props?.type,
      targetId: userId,
    })
    await setSwiperData(res.data)
    setLoadingState(true)
  }

  useEffect(() => {
    init()
  }, [])

  const getProjectId = (value: any) => {
    setProjectId(value)
  }

  if (!loadingState) {
    return <Loading />
  }

  return (
    <>
      {isMember && (
        <CommonNeed
          id={projectId}
          isMember={isMember}
          title={props?.title}
          type={props?.type}
          subTitle={props?.subTitle}
        />
      )}
      {!isMember && (
        <>
          <Title>{props?.title}</Title>
          <MainWrap>
            <MineSwiper data={swiperData} onTap={getProjectId} />
            <CommonNeed
              isMember={isMember}
              id={projectId}
              title={props?.title}
              type={props?.type}
              subTitle={props?.subTitle}
            />
          </MainWrap>
        </>
      )}
    </>
  )
}

export default MainIndex
