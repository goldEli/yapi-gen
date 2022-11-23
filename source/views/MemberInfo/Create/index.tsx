// 他的模块-他的创建

import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      title={t('newlyAdd.hisCreate')}
      type="create"
      subTitle={t('common.createDemand')}
    />
  )
}

export default Create
