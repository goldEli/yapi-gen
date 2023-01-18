// 我的审核主页

import { useEffect, useState } from 'react'

import { StaffHeader } from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import styled from '@emotion/styled'
import useSetTitle from '@/hooks/useSetTitle'
import { useSelector } from '@store/index'
import { getMineProjectList } from '@/services/mine'

const MainWrap = styled.div({
  height: 'calc(100% - 64px)',
  overflow: 'auto',
})

const Examine = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b4'))
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { userInfo } = useSelector(store => store.user)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [type, setType] = useState('verify')

  const init = async () => {
    const res = await getMineProjectList(type)
    await setSwiperData(res.data)
    setLoadingState(true)
  }
  useEffect(() => {
    init()
  }, [type])

  const getProjectId = (value: any) => {
    setProjectId(value)
  }
  if (!loadingState) {
    return <Loading />
  }
  return (
    <PermissionWrap
      auth="b/user/copysend/story"
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>{t('newlyAdd.mineExamine')}</StaffHeader>
      <MainWrap>
        <MineSwiper data={swiperData} onTap={getProjectId} />
        <Need projectId={projectId} onChangeType={(val: any) => setType(val)} />
      </MainWrap>
    </PermissionWrap>
  )
}

export default Examine
