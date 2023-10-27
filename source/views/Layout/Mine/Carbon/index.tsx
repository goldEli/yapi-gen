// 我的模块-我的待办

import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Carbon = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b1'))
  return (
    <MainIndex
      title={t('mine.mineCarbon')}
      type="abeyance"
      subTitle={t('mine.carbonDemand')}
    />
  )
}

export default Carbon
