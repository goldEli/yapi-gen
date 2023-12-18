// 他的模块-他的创建

import useSetTitle from '@/hooks/useSetTitle'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Create = () => {
  const [t] = useTranslation()
  const asyncSetTtile = useSetTitle()
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { projectInfo } = useSelector(store => store.project)
  asyncSetTtile(
    `${t('title.a5')}【${mainInfo.name}】${
      projectInfo.name ? `-【 ${projectInfo.name}】` : ''
    }`,
  )
  return (
    <MainIndex
      title={t('newlyAdd.hisCreate')}
      type="create"
      subTitle={t('createTask')}
    />
  )
}

export default Create
