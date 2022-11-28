// 我的模块-我创建的

import useSetTitle from '@/hooks/useSetTitle'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.b2'))
  return (
    <MainIndex
      auth="b/user/create/story"
      title={t('mine.mineCreate')}
      type="create"
      subTitle={t('common.createDemand')}
    />
  )
}

export default Create
