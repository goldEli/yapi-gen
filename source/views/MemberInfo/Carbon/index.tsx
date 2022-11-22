// 他的模块-他的待办

import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Carbon = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      title={t('newlyAdd.hisAbeyance')}
      type="abeyance"
      subTitle={t('mine.carbonDemand')}
    />
  )
}

export default Carbon
