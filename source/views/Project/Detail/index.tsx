// 项目详情主页

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { getParamsData } from '@/tools'
import { getStaffList } from '@/services/staff'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

const Detail = () => {
  const {
    getProjectInfo,
    getProjectPermission,
    setProjectPermission,
    getTagList,
    setIsRefreshIterateList,
    isRefreshIterateList,
    setSelectAllStaffData,
    isChangeProject,
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

  // 获取公司员工
  const getStaffData = async () => {
    const options = await getStaffList({ all: 1 })
    setSelectAllStaffData(options)
  }

  const getInit = async () => {
    getTagList({ projectId })
    getStaffData()
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (result.isPublic === 2 && !result.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
      getInit()
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
