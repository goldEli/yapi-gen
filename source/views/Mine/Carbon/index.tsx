// 我的模块-我的待办

import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Carbon = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      auth="b/user/abeyance/story"
      title={t('mine.mineCarbon')}
      type="abeyance"
      subTitle={t('mine.carbonDemand')}
    />
  )
}

export default Carbon
