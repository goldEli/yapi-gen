// 项目详情主页

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonOperation from './components/CommonOperation'
import styled from '@emotion/styled'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { setProjectInfo, setProjectInfoValues } from '@store/project'

const Wrap = styled.div({
  height: '100%',
  overflow: 'auto',
})

const Detail = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isRefresh } = useSelector(store => store.user)
  const { isChangeProject } = useSelector(store => store.project)
  // 用于私有项目权限过渡
  const [isShowPage, setIsShowPage] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (result.isPublic === 2 && !result.isMember) {
      navigate('/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }

  // 用于编辑更新
  const onUpdate = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  useEffect(() => {
    if (isRefresh || isChangeProject) {
      getInfo()
      getProjectInfoValuesData()
    }
  }, [isRefresh, isChangeProject])

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
  }, [])

  return (
    <Wrap>
      {isShowPage && (
        <>
          <CommonOperation
            onUpdate={onUpdate}
            onChangeIdx={getProjectInfoValuesData}
          />
          <Outlet key={isChangeProject} />
        </>
      )}
    </Wrap>
  )
}

export default Detail
