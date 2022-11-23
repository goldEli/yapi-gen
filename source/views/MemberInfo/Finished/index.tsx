// 他的模块-他的已办

import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Finish = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      title={t('newlyAdd.hisFinish')}
      type="finish"
      subTitle={t('mine.finishDemand')}
    />
  )
}

export default Finish
