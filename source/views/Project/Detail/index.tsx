// 项目详情主页

/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect } from 'react'
import { getParamsData, filterTreeData } from '@/tools'
import { getTreeList } from '@/services/project/tree'
import { storyConfigCategoryList } from '@/services/project'
import { getStaffList } from '@/services/staff'

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
    setSelectTreeData,
    setSelectAllStaffData,
    getFieldList,
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
    setSelectTreeData(newTreeData[0].children)
    const newLieBieData = filArr2(res2.list)
    if (projectInfo?.filterFelid) {
      const allList = projectInfo?.filterFelid?.map((item: any) => {
        if (item.content === 'iterate_name') {
          item.values = [
            { id: -1, content: '空', content_txt: '空' },
            ...selectIterate.list?.map((i: any) => {
              return {
                id: i.id,
                content: i.name,
                content_txt: i.name,
              }
            }),
          ]
        }
        if (item.content === 'priority' || item.content === 'tag') {
          item.values = [
            { id: -1, content: '空', content_txt: '空' },
            ...item.values,
          ]
        }
        if (
          item.content === 'user_name' ||
          item.content === 'users_name' ||
          item.content === 'users_copysend_name'
        ) {
          item.values = [
            { id: -1, content: '空', content_txt: '空' },
            ...memberList?.map((k: any) => {
              return {
                id: k.id,
                content: k.name,
                content_txt: k.name,
              }
            }),
          ]
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
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...newLieBieData,
            ],
          }
        } else if (item.attr) {
          const filterData = filArr(item?.values) || []
          return {
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            type: item.attr,
            isDefault: item.is_default_filter,
            contentTxt: item.content_txt,
            children: [
              { id: -1, content: '空', content_txt: '空' },
              ...filterData,
            ],
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
  }

  const getFieldData = async () => {
    await getFieldList({ projectId })
  }

  // 获取公司员工
  const getStaffData = async () => {
    const options = await getStaffList({ all: 1 })
    setSelectAllStaffData(options)
  }

  useEffect(() => {
    getProjectInfo({ projectId })
    getPermissionList()
    getProjectCoverList()
    getMemberList({ all: true, projectId })
    getTagList({ projectId })
    getIterateList()
    getFieldData()
    getStaffData()
  }, [isRefresh])

  useEffect(() => {
    if (isRefreshIterateList) {
      getIterateList()
    }
  }, [isRefreshIterateList])

  useEffect(() => {
    if (
      projectInfo.id &&
      selectIterate?.list?.length > 0 &&
      memberList?.length > 0
    ) {
      getTreeData()
    }
  }, [projectInfo, selectIterate, memberList])

  return (
    <Wrap>
      <CommonOperation onUpdate={() => getProjectInfo({ projectId })} />
      <Outlet />
    </Wrap>
  )
}

export default Detail
