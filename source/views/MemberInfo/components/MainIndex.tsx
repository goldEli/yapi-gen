/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { StaffHeader } from '@/components/StyleCommon'
import CommonNeed from './CommonNeed'
import MineSwiper from '../components/MineSwiper'
import Loading from '@/components/Loading'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const MainWrap = styled.div({
  height: 'calc(100% - 64px)',
  overflow: 'auto',
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
  const { getUserInfoProject } = useModel('member')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProjectId = (value: any) => {
    setProjectId(value)
  }

  if (!loadingState) {
    return <Loading />
  }

  return (
    <>
      {isMember ? (
        <CommonNeed
          id={projectId}
          isMember={isMember}
          title={props?.title}
          type={props?.type}
          subTitle={props?.subTitle}
        />
      ) : (
        <>
          <StaffHeader>{props?.title}</StaffHeader>
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
