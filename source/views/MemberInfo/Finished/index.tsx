// 他的模块-他的已办
import useSetTitle from '@/hooks/useSetTitle'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import MainIndex from '../components/MainIndex'

const Finish = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const { mainInfo } = useModel('member')
  const { projectInfo } = useModel('project')
  asyncSetTtile(
    `${t('title.a6')}【${mainInfo.name}】${
      projectInfo.name ? `-【 ${projectInfo.name}】` : ''
    }`,
  )
  return (
    <MainIndex
      title={t('newlyAdd.hisFinish')}
      type="finish"
      subTitle={t('mine.finishDemand')}
    />
  )
}

export default Finish
