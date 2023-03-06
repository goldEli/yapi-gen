import styled from '@emotion/styled'
import { t } from 'i18next'
import { Outlet, useLocation } from 'react-router-dom'

const Title = styled.div`
  height: 32px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #323233;
  line-height: 32px;
  margin: 20px;
  margin-bottom: 0px;
`

const Mine = () => {
  const location = useLocation()
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
    <div>
      <Title>{setTitle()?.name}</Title>
      <Outlet />
    </div>
  )
}

export default Mine
