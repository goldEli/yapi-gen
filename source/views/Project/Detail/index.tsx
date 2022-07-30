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
    getMemberList,
    getTagList,
    getPermission,
    setUsePermission,
  } = useModel('project')
  const { getIterateSelectList } = useModel('iterate')
  const { userInfo } = useModel('user')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const getUsePermissionList = async (list: any) => {
    const result = await getPermission({
      projectId,
      roleId: list?.find((i: any) => i.label === userInfo?.group_name).value,
    })
    let arr: any[] = []
    result.list?.forEach((element: any) => {
      arr = [...arr, ...element.children]
    })
    setUsePermission(arr)
  }

  const getPermissionList = async () => {
    const result = await getProjectPermission({ projectId })
    const arr = result.list?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setProjectPermission(arr)
    getUsePermissionList(arr)
  }

  useEffect(() => {
    getProjectInfo({ projectId })
    getProjectCoverList()
    getPermissionList()
    getMemberList({ all: true, projectId })
    getTagList({ projectId })
    getIterateSelectList({ projectId })
  }, [])

  return (
    <Wrap>
      <CommonOperation onUpdate={() => getProjectInfo({ projectId })} />
      <Outlet />
    </Wrap>
  )
}

export default Detail
