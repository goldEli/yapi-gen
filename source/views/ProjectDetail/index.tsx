import RightWran from '@/hooks/useRightWran'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { setActiveCategory, setCategoryList } from '@store/category'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { saveInputKey } from '@store/view'
import { useEffect, useState } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

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
  const routerPath = useLocation()
  const [searchParams] = useSearchParams()
  const [isShowPage, setIsShowPage] = useState(false)
  const paramsData = getParamsData(searchParams)
  const { projectInfo } = useSelector(store => store.project)

  // 预警小铃铛是否显示，项目设置不展示和没有配置预警规则，且不等于项目成员
  const isShowWarn =
    projectInfo?.project_warring_info?.warring_list_nums &&
    !routerPath?.pathname.includes('/ProjectDetail/Setting') &&
    !routerPath?.pathname.includes('/ProjectDetail/Member')
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

  useEffect(() => {
    sessionStorage.setItem(
      'cache_project_url',
      location.href.replace(location.origin, ''),
    )
  }, [location.href])

  return (
    <ProjectWrap>
      {isShowPage ? (
        <>
          {isShowWarn && <RightWran />}
          <Outlet />
        </>
      ) : null}
    </ProjectWrap>
  )
}

export default ProjectDetail
