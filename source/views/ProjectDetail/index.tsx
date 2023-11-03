import styled from '@emotion/styled'
import { setActiveCategory, setCategoryList } from '@store/category'
import { useDispatch, useSelector } from '@store/index'
import { saveInputKey } from '@store/view'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const ProjectWrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  background: var(--neutral-white-d1);
`

const ProjectDetail = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { projectInfo } = useSelector(store => store.project)
  const [isShowPage, setIsShowPage] = useState(false)

  useEffect(() => {
    // 判断如果当前项目是私有项目并且当前登录者不是项目成员则跳转无权限界面
    if (
      (projectInfo?.isPublic === 2 || projectInfo?.is_public === 2) &&
      !projectInfo?.isMember &&
      !projectInfo?.user_ismember
    ) {
      navigate('/ProjectDetail/PrivatePermission')
    } else {
      setIsShowPage(true)
    }
  }, [projectInfo])

  useEffect(() => {
    dispatch(saveInputKey(''))
  }, [location.pathname])

  useEffect(() => {
    dispatch(setActiveCategory({}))
    dispatch(setCategoryList([]))
  }, [])

  return (
    <ProjectWrap>
      <Outlet />
    </ProjectWrap>
  )
}

export default ProjectDetail
