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
    memberList,
    projectInfo,
    setFilterAll,
  } = useModel('project')
  const { getIterateSelectList, selectIterate } = useModel('iterate')
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
    getMemberList({ all: true, projectId })
    getTagList({ projectId })
    getIterateSelectList({ projectId, all: true })
  }, [])

  useEffect(() => {
    const allList = projectInfo.filterFelid?.map((item: any) => {
      if (item.content === 'iterate_name') {
        item.values = selectIterate.list?.map((i: any) => {
          return {
            id: i.id,
            content: i.name,
          }
        })
      }
      if (
        item.content === 'user_name'
        || item.content === 'users_name'
        || item.content === 'users_copysend_name'
      ) {
        item.values = memberList?.map((k: any) => {
          return {
            id: k.id,
            content: k.name,
          }
        })
      }
      return item
    })

    const filterAllList = allList?.map((item: any) => {
      if (item.title.includes('时间')) {
        return {
          id: item.id,
          name: item.title,
          key: item.content,
          content: item.content,
          children: item.values,
          type: 'time',
          isDefault: item.is_default_filter,
        }
      }
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'select',
        isDefault: item.is_default_filter,
      }

    })

    setFilterAll(filterAllList)
  }, [memberList, selectIterate, projectInfo])

  return (
    <Wrap>
      <CommonOperation onUpdate={() => getProjectInfo({ projectId })} />
      <Outlet />
    </Wrap>
  )
}

export default Detail
