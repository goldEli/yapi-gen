import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { setActiveCategory, setCategoryList } from '@store/category'
import { useDispatch } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { saveInputKey } from '@store/view'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  background: var(--neutral-white-d1);
`

const ProjectDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isShowPage, setIsShowPage] = useState(false)
  const paramsData = getParamsData(searchParams)

  // 获取项目详情
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId: paramsData?.id })
    dispatch(setProjectInfo(result))
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (
      (result?.isPublic === 2 || result?.is_public === 2) &&
      !result?.isMember &&
      !result?.user_ismember
    ) {
      navigate('/ProjectDetail/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }

  // 获取项目配置
  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId: paramsData?.id }, 1)
    dispatch(setProjectInfoValues(result))
  }
  useEffect(() => {
    if (paramsData?.id) {
      getInfo()
      getProjectInfoValuesData()
      dispatch(setActiveCategory({}))
      dispatch(setCategoryList([]))
      dispatch(saveInputKey(''))
    }
  }, [paramsData?.id])

  return <ProjectWrap>{isShowPage ? <Outlet /> : null}</ProjectWrap>
}

export default ProjectDetail
