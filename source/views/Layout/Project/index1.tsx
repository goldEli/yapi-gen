import { useState } from 'react'
import HeaderFilter from './components/HeaderFilter'
import { ProjectIndexWrap } from './style'

const ProjectIndex = () => {
  const [isGrid, setIsGrid] = useState(false)

  //   筛选条件变化后更新数据 或者是 刷新
  const onChangeParamsUpdate = (params: any, isRefresh?: boolean) => {
    //
  }

  return (
    <ProjectIndexWrap>
      <HeaderFilter
        isGrid={isGrid}
        onChangeGrid={setIsGrid}
        onChangeParamsUpdate={onChangeParamsUpdate}
      />
    </ProjectIndexWrap>
  )
}

export default ProjectIndex
