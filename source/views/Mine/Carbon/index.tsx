import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { StaffHeader } from '@/components/StyleCommon'
import Need from './components/Need'
import MineSwiper from '../components/MineSwiper'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import styled from '@emotion/styled'

const MainWrap = styled.div({
  height: 'calc(100% - 64px)',
  overflow: 'auto',
})

const Finished = () => {
  const [t] = useTranslation()
  const [swiperData, setSwiperData] = useState([])
  const [projectId, setProjectId] = useState(0)
  const { getMineProjectList } = useModel('mine')
  const { userInfo } = useModel('user')
  const [loadingState, setLoadingState] = useState<boolean>(false)

  const init = async () => {
    const res = await getMineProjectList('abeyance')
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
      auth="b/user/abeyance/story"
      permission={userInfo?.company_permissions}
    >
      <StaffHeader>{t('mine.mineNeedDeal')}</StaffHeader>
      <MainWrap>
        <MineSwiper data={swiperData} onTap={getProjectId} />
        <Need id={projectId} />
      </MainWrap>
    </PermissionWrap>
  )
}

export default Finished
