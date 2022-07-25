/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

const Detail = () => {
  const { getProjectInfo, getProjectCoverList } = useModel('project')
  useEffect(() => {
    getProjectInfo({ projectId: 66 })
    getProjectCoverList()
  }, [])
  return (
    <Wrap>
      <CommonOperation />
      <Outlet />
    </Wrap>
  )
}

export default Detail
