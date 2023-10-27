// 我的模块-我的已办

import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b3'))
  return (
    <MainIndex
      title={t('mine.mineFinish')}
      type="finish"
      subTitle={t('mine.finishDemand')}
    />
  )
}

export default Create
