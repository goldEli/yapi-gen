import React from 'react'
import styled from '@emotion/styled'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { useDispatch } from '@store/index'
import { onFilter } from '@store/kanBan/kanBan.thunk'
import useProjectType from '../hooks/useProjectType'

interface TopAreaProps {}

const TopArea: React.FC<TopAreaProps> = props => {
  const dispatch = useDispatch()
  const { projectType } = useProjectType()
  const keyword = projectType === 1 ? '需求' : '事务'
  const title = `搜索${keyword}或者编号`
  return (
    <ProjectCommonOperation
      title={title}
      onInputSearch={async val => {
        dispatch(onFilter())
      }}
    />
  )
}

export default TopArea
