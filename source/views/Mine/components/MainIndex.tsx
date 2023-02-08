// 我的模块所有页面公用布局

import { useEffect, useState } from 'react'
import { StaffHeader } from '@/components/StyleCommon'
import CommonNeed from './CommonNeed'
import MineSwiper from '../components/MineSwiper'
import PermissionWrap from '@/components/PermissionWrap'
import Loading from '@/components/Loading'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { getMineProjectList } from '@/services/mine'

const MainWrap = styled.div({
  height: 'calc(100% - 64px)',
  overflow: 'auto',
})

interface Props {
  title: any
  type: any
  subTitle: any
  auth: any
}

const MainIndex = (props: Props) => {
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { userInfo } = useSelector(store => store.user)
  const [loadingState, setLoadingState] = useState<boolean>(false)

  const init = async () => {
    const res = await getMineProjectList(props?.type)
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
    <PermissionWrap
      auth={props?.auth}
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>{props?.title}</StaffHeader>
      <MainWrap>
        <MineSwiper data={swiperData} onTap={getProjectId} />
        <CommonNeed
          id={projectId}
          title={props?.title}
          type={props?.type}
          subTitle={props?.subTitle}
        />
      </MainWrap>
    </PermissionWrap>
  )
}

export default MainIndex
