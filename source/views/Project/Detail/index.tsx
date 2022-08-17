/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'
import { decryptPhp } from '@/tools/cryptoPhp'
import { getParamsData } from '@/tools'

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
    setIsRefreshIterateList,
    isRefreshIterateList,
  } = useModel('project')
  const { getIterateSelectList, selectIterate } = useModel('iterate')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isRefresh } = useModel('user')

  const getPermissionList = async () => {
    const result = await getProjectPermission({ projectId })
    const arr = result.list?.map((i: any) => ({
      label: i.name,
      value: i.id,
    }))
    setProjectPermission(arr)
  }

  const getIterateList = async () => {
    await getIterateSelectList({ projectId, all: true })
    setIsRefreshIterateList(false)
  }

  useEffect(() => {
    getProjectInfo({ projectId })
    getProjectCoverList()
    getPermissionList()
    getMemberList({ all: true, projectId })
    getTagList({ projectId })
    getIterateList()
  }, [])

  useEffect(() => {
    if (isRefresh) {
      getProjectInfo({ projectId })
      getPermissionList()
    }
  }, [isRefresh])

  useEffect(() => {
    if (isRefreshIterateList) {
      getIterateList()
    }
  }, [isRefreshIterateList])

  useEffect(() => {
    const allList = projectInfo.filterFelid?.map((item: any) => {
      if (item.content === 'iterate_name') {
        item.values = selectIterate.list?.map((i: any) => {
          return {
            id: i.id,
            content: i.name,
            content_txt: i.name,
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
            content_txt: k.name,
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
          contentTxt: item.content_txt,
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
        contentTxt: item.content_txt,
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
