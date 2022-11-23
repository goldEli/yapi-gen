// 他的模块-他的待办

import useSetTitle from '@/hooks/useSetTitle'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Carbon = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const { mainInfo } = useModel('member')
  asyncSetTtile(`${t('title.a4')}【${mainInfo.name}】`)

  return (
    <MainIndex
      title={t('newlyAdd.hisAbeyance')}
      type="abeyance"
      subTitle={t('mine.carbonDemand')}
    />
  )
}

export default Carbon
