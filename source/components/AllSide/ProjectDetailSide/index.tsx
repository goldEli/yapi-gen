// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import DemandSettingSide from '../DemandSettingSide'
import FormWorkSide from '../FormWorkSide'
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
  WrapCategory,
} from './style'

export const Back = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  margin-bottom: 14px;
  margin-left: 19px;
  &:hover {
    cursor: pointer;
    color: var(--primary-d1);
  }
`
const ProjectDetailSide = () => {
  const [t] = useTranslation()
  const projectSide: any = useRef<HTMLInputElement>(null)
  const projectSetSide: any = useRef<HTMLInputElement>(null)
  const projectSetCategory: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const routerPath = useLocation()
  const navigate = useNavigate()

  const menuList = [
    {
      name: t('demand'),
      icon: 'demand',
      path: '/ProjectManagement/Demand',
      isPermission:
        projectInfo?.isPublic === 1
          ? true
          : projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('需求'),
            ).length,
    },
    {
      name: t('iteration'),
      icon: 'interation-2',
      path: '/ProjectManagement/Iteration',
      isPermission:
        projectInfo?.isPublic === 1
          ? true
          : projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('迭代'),
            ).length,
    },
  ]

  const sideList = [
    {
      name: t('project.projectInformation'),
      icon: 'file-text',
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'info',
    },
    {
      name: t('project.projectMember'),
      icon: 'team',
      path: '/ProjectManagement/ProjectSetting',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/member'),
      ).length,
      key: 'member',
    },
    {
      name: t('project.projectPermissionGroup'),
      icon: 'lock',
      path: '/ProjectManagement/ProjectSetting',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/role'),
      ).length,
      key: 'permission',
    },
    {
      name: t('newlyAdd.demandSet'),
      icon: 'settings',
      path: '/ProjectManagement/ProjectSetting',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/story_config'),
      ).length,
      key: 'main',
    },
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

  //   点击需求设置
  const onChangeSetCategory = (isInit?: boolean) => {
    projectSide.current.style.width = '0px'
    projectSetSide.current.style.width = '0px'
    projectSetCategory.current.style.width = '100%'
    projectSetCategory.current.style.display = 'block'
    if (isInit) {
      const params = encryptPhp(JSON.stringify({ id: projectId }))
      navigate(`/ProjectManagement/DemandSetting?data=${params}`)
    }
  }

  //   点击项目设置
  const onChangeSet = (isInit?: boolean) => {
    projectSide.current.style.width = '0px'
    projectSetCategory.current.style.width = '0px'
    projectSetSide.current.style.width = '100%'
    projectSetSide.current.style.display = 'block'
    if (isInit) {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, pageIdx: 'main', type: 0 }),
      )
      navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
    }
  }

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
    if ([0, 1, 2].includes(paramsData?.type)) {
      onChangeSet()
    }
    if (paramsData?.type === 3 || paramsData?.pageIdx === 'work') {
      onChangeSetCategory()
    }
  }, [projectId])

  //   返回上一页
  const onGoBack = () => {
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = '100%'
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`/ProjectManagement/Demand?data=${params}`)
    setTimeout(() => {
      console.log(projectSetSide.current, '=====projectSetSide.current')
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  // 点击切换模块
  const onChangeRouter = (path: string) => {
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`${path}?data=${params}`)
  }

  const onToInfo = (item: any, index: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: index,
        id: projectInfo.id,
        pageIdx: item.key,
      }),
    )
    navigate(`${item.path}?data=${params}`)
    if (index === 3) {
      onChangeSetCategory()
    }
  }

  const onCategoryBack = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: 0,
        id: projectInfo.id,
        pageIdx: 'info',
      }),
    )
    navigate(`/ProjectManagement/ProjectSetting?data=${params}`)
    onChangeSet()
  }

  useEffect(() => {
    if (paramsData?.pageIdx) {
      // 配置工作流或者是没有type的，跳转需求/迭代侧边栏
      if (!paramsData?.type && paramsData.pageIdx !== 'work') {
        projectSide.current.style.width = '0px'
        projectSetCategory.current.style.width = '0px'
        projectSetSide.current.style.width = '100%'
        projectSetSide.current.style.display = 'block'
      }
    } else {
      projectSetSide.current.style.width = '0px'
      projectSetCategory.current.style.width = '0px'
      projectSide.current.style.width = '100%'
      setTimeout(() => {
        projectSetSide.current.style.display = 'none'
      }, 200)
    }
  }, [paramsData])

  return (
    <AllWrap>
      <WrapDetail ref={projectSide}>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div>{projectInfo.name}</div>
            <span>
              {projectInfo.teamId ? t('teamwork') : t('enterprise_project')}
            </span>
          </SideInfo>
        </SideTop>
        <Provider />
        <MenuBox>
          {menuList.map((i: any) => (
            <MenuItem
              key={i.icon}
              isActive={routerPath.pathname === i.path}
              onClick={() => onChangeRouter(i.path)}
              hidden={!i.isPermission}
            >
              <CommonIconFont type={i.icon} size={18} />
              <div>{i.name}</div>
            </MenuItem>
          ))}
        </MenuBox>
        <SideFooter onClick={() => onChangeSet(true)}>
          <div>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>{t('project.projectSet')}</div>
          </div>
        </SideFooter>
      </WrapDetail>

      <WrapSet ref={projectSetSide}>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div>{projectInfo.name}</div>
            <span>
              {projectInfo.teamId ? t('teamwork') : t('enterprise_project')}
            </span>
          </SideInfo>
        </SideTop>
        <Back onClick={onGoBack}>
          <CommonIconFont type="left-md" />
          <span style={{ marginLeft: '2px' }}>{t('back')}</span>
        </Back>
        <Provider />
        <MenuBox>
          {sideList.map((i: any, index: number) => (
            <MenuItem
              key={i.icon}
              isActive={paramsData?.type === index}
              onClick={() => onToInfo(i, index)}
              hidden={!i.isPermission}
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
      </WrapSet>

      <WrapCategory ref={projectSetCategory}>
        <DemandSettingSide onClick={onCategoryBack} onBack={onGoBack} />
      </WrapCategory>
    </AllWrap>
  )
}

export default ProjectDetailSide
