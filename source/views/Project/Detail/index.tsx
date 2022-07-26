/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

const Detail = () => {
  const { getProjectInfo, getProjectCoverList } = useModel('project')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  useEffect(() => {
    getProjectInfo({ projectId })
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
