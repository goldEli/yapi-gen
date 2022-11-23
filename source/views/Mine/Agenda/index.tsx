// 我的模块-抄送我的

import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const CopySend = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      auth="b/user/copysend/story"
      title={t('mine.mineCopySend')}
      type="copysend"
      subTitle={t('mine.copyDemand')}
    />
  )
}

export default CopySend
