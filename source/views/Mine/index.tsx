import PermissionWrap from '@/components/PermissionWrap'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { t } from 'i18next'
import { Outlet, useLocation } from 'react-router-dom'

const Title = styled.div`
  height: 32px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  line-height: 32px;
  margin: 20px;
  margin-bottom: 0px;
`

const Mine = () => {
  const location = useLocation()
  const { menuPermission } = useSelector(store => store.user)
  const setTitle = () => {
    const nowPath = location.pathname
    const titles = [
      {
        path: 'Profile',
        name: t('mine.mineSurvey'),
      },
      {
        path: 'Carbon',
        name: t('mine.mineNeedDeal'),
      },
      {
        path: 'Create',
        name: t('mine.mineCreate'),
      },
      {
        path: 'Finished',
        name: t('mine.mineFinish'),
      },
      {
        path: 'Agenda',
        name: t('mine.copyMine'),
      },
      {
        path: 'Examine',
        name: t('newlyAdd.mineExamine'),
      },
    ]
    const newName = titles.find((i: any) => nowPath.includes(i.path))
    return newName
  }

  return (
    <PermissionWrap
      auth="/ProjectManagement/Mine"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/ProjectManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <Title>{setTitle()?.name}</Title>
      <Outlet />
    </PermissionWrap>
  )
}

export default Mine
