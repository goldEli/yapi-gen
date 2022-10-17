import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const [t] = useTranslation()
  return (
    <MainIndex
      auth="b/user/finish/story"
      title={t('mine.mineFinish')}
      type="finish"
      subTitle={t('mine.finishDemand')}
    />
  )
}

export default Create
