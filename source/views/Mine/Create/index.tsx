import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const [t] = useTranslation()
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
