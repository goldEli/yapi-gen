// 他的模块-他的待办

import useSetTitle from '@/hooks/useSetTitle'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Carbon = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const { mainInfo } = useSelector((store: { member: any }) => store.member)
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
  asyncSetTtile(
    `${t('title.a4')}【${mainInfo.name}】${
      projectInfo.name ? `-【 ${projectInfo.name}】` : ''
    }`,
  )

  return (
    <MainIndex
      title={t('newlyAdd.hisAbeyance')}
      type="abeyance"
      subTitle={t('mine.carbonDemand')}
    />
  )
}

export default Carbon
