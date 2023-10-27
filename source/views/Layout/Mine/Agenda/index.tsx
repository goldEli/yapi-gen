// 我的模块-抄送我的

import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const CopySend = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b41'))
  return (
    <MainIndex
      title={t('mine.mineCopySend')}
      type="copysend"
      subTitle={t('mine.copyDemand')}
    />
  )
}

export default CopySend
