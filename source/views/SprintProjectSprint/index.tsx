import React from 'react'
import GuideModal from '@/components/GuideModal'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'
import { useTranslation } from 'react-i18next'
import { setGuideVisible } from '@store/sprint'
import { useDispatch, useSelector } from '@store/index'

interface IProps {}
const SprintProjectSprint: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { guideVisible } = useSelector(store => store.sprint)
  const [t] = useTranslation()
  const inform = [
    {
      key: 0,
      title: '开始冲刺前的第一步',
      desc: '这里可以为积压的工作创建一个工作目标，提前来规划您的工作',
      img: guide_1,
    },
    {
      key: 1,
      title: '开始冲刺前的第二步',
      desc: '点击编辑冲刺，为您的冲刺团队准备好目标规则，开始工作吧',
      img: guide_2,
    },
    {
      key: 2,
      title: '开始冲刺前的第三步',
      desc: '为冲刺添加积压的工作，并点击开始冲刺来完成冲刺目标；另外您还可以为事务加上长故事定制功能集',
      img: guide_3,
    },
  ]
  return (
    <div>
      SprintProjectSprint
      <GuideModal
        width={784}
        height={670}
        visible={guideVisible}
        inform={inform}
        close={() => dispatch(setGuideVisible(false))}
      />
    </div>
  )
}
export default SprintProjectSprint
