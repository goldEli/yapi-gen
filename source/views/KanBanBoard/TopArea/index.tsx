import React from 'react'
import styled from '@emotion/styled'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { useDispatch } from '@store/index'
import { onFilter } from '@store/kanBan/kanBan.thunk'

interface TopAreaProps {}

const TopArea: React.FC<TopAreaProps> = props => {
  const dispatch = useDispatch()
  return (
    <ProjectCommonOperation
      onInputSearch={async val => {
        dispatch(onFilter())
      }}
    />
  )
}

export default TopArea
