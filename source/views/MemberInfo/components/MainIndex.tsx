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
  height: '100%',
  overflowY: 'scroll',
  padding: '0px  0px',
  background: 'var(--neutral-white-d1)',
})

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
      )}
    </>
  )
}

export default MainIndex
