import GuideModal from '@/components/GuideModal'
import { useDispatch, useSelector } from '@store/index'
import { onChangeGuideVisible } from '@store/kanBan'
import React from 'react'
import guide_1 from './img/guide_1.png'
import guide_2 from './img/guide_2.png'
import guide_3 from './img/guide_3.png'

const useGuideModal = () => {
  const dispatch = useDispatch()
  const { guideVisible } = useSelector(store => store.sprintKanBan)
  const inform = [
    {
      key: 0,
      title: 'Kanban工作项的状态',
      desc: '卡片状态根据可拖动的目的地来改变ta的最终状态',
      img: guide_1,
    },
    {
      key: 1,
      title: '分组视图',
      desc: '同时支持按人员、类别、优先级三个横向参数进行工作对比与查看',
      img: guide_2,
    },
    {
      key: 2,
      title: '列与状态',
      desc: '可以按不同工作流进行纵向筛选，如需定义工作流可在配置看板中新增或编辑ta',
      img: guide_3,
    },
  ]
  const guildModalEl = (
    <GuideModal
      width={784}
      height={670}
      visible={guideVisible}
      inform={inform}
      close={() => dispatch(onChangeGuideVisible(false))}
    />
  )
  return {
    guildModalEl,
  }
}

export default useGuideModal
