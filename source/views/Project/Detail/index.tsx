// 项目详情主页

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { getParamsData, filterTreeData } from '@/tools'
import { getTreeList } from '@/services/project/tree'
import { storyConfigCategoryList } from '@/services/project'
import { getStaffList, getStaffList2 } from '@/services/staff'

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
    setFilterAll,
    setIsRefreshIterateList,
    isRefreshIterateList,
    setSelectTreeData,
    setSelectAllStaffData,
    getFieldList,
    isChangeProject,
    getPriorityList,
  } = useModel('project')
  const { getIterateSelectList } = useModel('iterate')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isRefresh } = useModel('user')
  // 用于私有项目权限过渡
  const [isShowPage, setIsShowPage] = useState(false)
  const navigate = useNavigate()

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
    const result = await getIterateSelectList({ projectId, all: true })
    setIsRefreshIterateList(false)
    return result
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

  const getTreeData = async (
    projectInfo: any,
    selectIterate: any,
    memberList: any,
  ) => {
    const companyList = await getStaffList2({ all: 1 })

    const filterCompanyList = companyList.map((i: any) => ({
      id: i.id,
      content: i.name,
      content_txt: i.name,
    }))

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
            ...(selectIterate?.list?.map((i: any) => {
              return {
                id: i.id,
                content: i.name,
                content_txt: i.name,
              }
            }) || []),
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
            ...(memberList?.map((k: any) => {
              return {
                id: k.id,
                content: k.name,
                content_txt: k.name,
              }
            }) || []),
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
        } else if (item.attr === 'number') {
          return {
            ...item,
            id: item.id,
            name: item.title,
            key: item.content,
            content: item.content,
            children: item.values,
            type: item.values[0],
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
          // 成员

          if (item.attr === 'user_select') {
            if (item.values[0] === 'projectMember') {
              return {
                id: item.id,
                name: item.title,
                key: item.content,
                content: item.content,
                type: 'dan',
                isDefault: item.is_default_filter,
                contentTxt: item.content_txt,
                children: [
                  { id: -1, content: '空', content_txt: '空' },
                  ...(memberList?.map((k: any) => {
                    return {
                      id: k.id,
                      content: k.name,
                      content_txt: k.name,
                    }
                  }) || []),
                ],
              }
            }
            if (item.values[0] === 'companyMember') {
              return {
                id: item.id,
                name: item.title,
                key: item.content,
                content: item.content,
                type: 'dan',
                isDefault: item.is_default_filter,
                contentTxt: item.content_txt,
                children: [
                  { id: -1, content: '空', content_txt: '空' },
                  ...filterCompanyList,
                ],
              }
            }
          }
          if (item.attr === 'user_select_checkbox') {
            if (item.values[0] === 'projectMember') {
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
                  ...(memberList?.map((k: any) => {
                    return {
                      id: k.id,
                      content: k.name,
                      content_txt: k.name,
                    }
                  }) || []),
                ],
              }
            }
            if (item.values[0] === 'companyMember') {
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
                  ...filterCompanyList,
                ],
              }
            }
          }
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

  const getInit = async (projectInfo: any) => {
    const [selectIterate, memberList] = await Promise.all([
      getIterateList(),
      getMemberList({ all: true, projectId }),
    ])
    getPermissionList()
    getProjectCoverList()
    getTagList({ projectId })
    getFieldData()
    getStaffData()
    getTreeData(projectInfo, selectIterate, memberList)
    getPriorityList({ projectId, type: 'priority' })
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (result.isPublic === 2 && !result.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
      getInit(result)
    }
  }

  useEffect(() => {
    getInfo()
  }, [isRefresh, isChangeProject])

  useEffect(() => {
    if (isRefreshIterateList) {
      getIterateList()
    }
  }, [isRefreshIterateList])

  return (
    <Wrap>
      {isShowPage && (
        <>
          <CommonOperation onUpdate={() => getProjectInfo({ projectId })} />
          <Outlet key={isChangeProject} />
        </>
      )}
    </Wrap>
  )
}

export default Detail
