// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  Provider,
  SideFooter,
  SideInfo,
  SideTop,
  WrapSet,
  WrapDetail,
} from './style'

const ProjectDetailSide = (props: { leftWidth: number }) => {
  const projectSide: any = useRef<HTMLInputElement>(null)
  const projectSetSide: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo } = useSelector(store => store.project)
  const routerPath = useLocation()
  const navigate = useNavigate()

  const menuList = [
    { name: '需求', icon: 'demand', path: '/ProjectManagement/Demand' },
    { name: '迭代', icon: 'interation', path: '/ProjectManagement/Iteration' },
  ]

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
  }, [])

  //   点击项目设置
  const onChangeSet = () => {
    projectSide.current.style.width = '0px'
    projectSetSide.current.style.width = `${props.leftWidth}px`
    projectSetSide.current.style.display = 'block'
  }

  //   返回上一页
  const onGoBack = () => {
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = `${props.leftWidth}px`
    setTimeout(() => {
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  // 点击切换模块
  const onChangeRouter = (path: string) => {
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`${path}?data=${params}`)
  }

  return (
    <AllWrap>
      <WrapDetail ref={projectSide}>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div>{projectInfo.name}</div>
            <span>{projectInfo.teamId ? '团队项目' : '企业项目'}</span>
          </SideInfo>
        </SideTop>
        <Provider />
        <MenuBox>
          {menuList.map((i: any) => (
            <MenuItem
              key={i.icon}
              isActive={routerPath.pathname === i.path}
              onClick={() => onChangeRouter(i.path)}
            >
              <CommonIconFont
                type={i.icon}
                color="var(--neutral-n3)"
                size={18}
              />
              <div>{i.name}</div>
            </MenuItem>
          ))}
        </MenuBox>
        <SideFooter onClick={onChangeSet}>
          <div>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>项目设置</div>
          </div>
        </SideFooter>
      </WrapDetail>
      <WrapSet ref={projectSetSide}>
        <div>
          1212
          <span onClick={onGoBack}>返回上一页</span>
        </div>
      </WrapSet>
    </AllWrap>
  )
}

export default ProjectDetailSide
