// 他的模块-他的创建

import useSetTitle from '@/hooks/useSetTitle'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const [t] = useTranslation()
  const asyncSetTtile = useSetTitle()
  const { mainInfo } = useModel('member')
  asyncSetTtile(`${t('title.a5')}【${mainInfo.name}】`)
  return (
    <MainIndex
      title={t('newlyAdd.hisCreate')}
      type="create"
      subTitle={t('common.createDemand')}
    />
  )
}

export default Create
