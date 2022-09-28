/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { getParamsData } from '@/tools'
import { getTreeList } from '@/services/project/tree'
import { storyConfigCategoryList } from '@/services/project'

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
      tagLabel: i.label,
    }))
    setProjectPermission(arr)
  }

  const getIterateList = async () => {
    await getIterateSelectList({ projectId, all: true })
    setIsRefreshIterateList(false)
  }

  function filterTreeData(data: any) {
    const newData = data.map((item: any) => ({
      title: item.name,
      value: item.id,
      children:
        item.children && item.children.length
          ? filterTreeData(item.children)
          : null,
    }))
    return newData
  }
  const filArr = (data: any) => {
    return data?.map((item: any) => {
      return {
        content_txt: item,
        id: item,
      }
    })
  }
  const filArr2 = (data: any) => {
    return data?.map((item: any) => {
      return {
        content_txt: item.name,
        id: item.id,
      }
    })
  }
  const getTreeData = async () => {
    const res = await getTreeList({ id: projectId })

    const res2 = await storyConfigCategoryList({
      projectId,
      isSelect: true,
    })

    const newTreeData = filterTreeData(res)
    const newLieBieData = filArr2(res2.list)

    const allList = projectInfo?.filterFelid?.map((item: any) => {
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
      if (item.title.includes('时间') && !item.attr) {
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
      } else if (item.title.includes('需求进度') && !item.attr) {
        return {
          id: item.id,
          name: item.title,
          key: item.content,
          content: item.content,
          children: item.values,
          type: 'number',
          isDefault: item.is_default_filter,
          contentTxt: item.content_txt,
        }
      } else if (item.title.includes('需求分类') && !item.attr) {
        return {
          id: item.id,
          name: item.title,
          key: item.content,
          content: item.content,
          type: 'tree',
          isDefault: item.is_default_filter,
          contentTxt: item.content_txt,
          children: newTreeData,
        }
      } else if (item.title.includes('需求类别') && !item.attr) {
        return {
          id: item.id,
          name: item.title,
          key: item.content,
          content: item.content,
          type: 'select_checkbox',
          isDefault: item.is_default_filter,
          contentTxt: item.content_txt,
          children: newLieBieData,
        }
      } else if (item.attr) {
        return {
          id: item.id,
          name: item.title,
          key: item.content,
          content: item.content,
          type: item.attr,
          isDefault: item.is_default_filter,
          contentTxt: item.content_txt,
          children: filArr(item?.values),
        }
      }
      return {
        id: item.id,
        name: item.title,
        key: item.content,
        content: item.content,
        children: item.values,
        type: 'select_checkbox',
        isDefault: item.is_default_filter,
        contentTxt: item.content_txt,
      }
    })

    setFilterAll(filterAllList)
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
    getTreeData()
  }, [memberList, selectIterate, projectInfo])
  useEffect(() => {
    getTreeData()
  }, [])

  return (
    <Wrap>
      <CommonOperation onUpdate={() => getProjectInfo({ projectId })} />
      <Outlet />
    </Wrap>
  )
}

export default Detail
