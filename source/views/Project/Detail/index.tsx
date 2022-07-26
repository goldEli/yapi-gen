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
  const {
    getProjectInfo,
    getProjectCoverList,
    getProjectPermission,
    setProjectPermission,
  } = useModel('project')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const getPermissionList = async () => {
    const result = await getProjectPermission({ projectId })
    const arr = result.list?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setProjectPermission(arr)
  }

  useEffect(() => {
    getProjectInfo({ projectId })
    getProjectCoverList()
    getPermissionList()
  }, [])
  return (
    <Wrap>
      <CommonOperation />
      <Outlet />
    </Wrap>
  )
}

export default Detail
