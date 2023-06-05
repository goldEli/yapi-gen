/* eslint-disable @typescript-eslint/padding-line-between-statements */
// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import DemandSettingSide from '../DemandSettingSide'
import { Button, Menu } from 'antd'
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
  const projectSide: any = useRef<HTMLDivElement>(null)
  const projectSetSide: any = useRef<HTMLDivElement>(null)
  const projectSetCategory: any = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  console.log('projectInfo', projectInfo)
  const [selectedKeys, setSelectedKeys] = useState(['ProjectInfo'])
  const routerPath = useLocation()
  const navigate = useNavigate()
  let menuList = [
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
    {
      name: 'KanBan',
      icon: 'layout',
      path: '/ProjectManagement/KanBan',
      isPermission:
        projectInfo?.isPublic === 1
          ? true
          : projectInfo?.projectPermissions?.filter(
              (i: any) => i.identity === 'b/project/kanban',
            ).length,
    },
    {
      name: '报表',
      icon: 'interation-2',
      path: '/Report/PerformanceInsight',
      isPermission: true,
      key: 'Report',
    },
    {
      name: '缺陷',
      icon: 'interation-2',
      path: '/ProjectManagement/Defect',
      isPermission:
        projectInfo?.isPublic === 1
          ? true
          : projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.group_name).includes('缺陷'),
            ).length,
    },
  ]
  const menuKeys = [
    'main',
    'info',
    'member',
    'permission',
    'note',
    'ProjectKanBan',
    'ProjectHome',
  ]
  const sideList = [
    // {
    //   name: t('project.projectInformation'),
    //   icon: 'file-text',
    //   path: '/ProjectManagement/ProjectSetting',
    //   isPermission: true,
    //   key: 'info',
    // },
    // {
    //   name: t('project.projectMember'),
    //   icon: 'team',
    //   path: '/ProjectManagement/ProjectSetting',
    //   isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
    //     String(i.identity).includes('b/project/member'),
    //   ).length,
    //   key: 'member',
    // },
    // {
    //   name: t('project.projectPermissionGroup'),
    //   icon: 'lock',
    //   path: '/ProjectManagement/ProjectSetting',
    //   isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
    //     String(i.identity).includes('b/project/role'),
    //   ).length,
    //   key: 'permission',
    // },
    // {
    //   name: t('newlyAdd.demandSet'),
    //   icon: 'settings',
    //   path: '/ProjectManagement/ProjectSetting',
    //   isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
    //     String(i.identity).includes('b/project/story_config'),
    //   ).length,
    //   key: 'main',
    // },
    // {
    //   name: t('notification_settings'),
    //   icon: 'bell',
    //   path: '/ProjectManagement/ProjectSetting',
    //   isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
    //     String(i.identity).includes('b/project/notification'),
    //   ).length,
    //   key: 'note',
    // },

    {
      label: '项目信息',
      icon: <CommonIconFont type="file-text" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'info',
    },
    {
      label: '项目成员',
      icon: <CommonIconFont type="team" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'member',
    },
    {
      label: '项目角色',
      icon: <CommonIconFont type="lock" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'permission',
    },
    {
      label: '通知配置',
      icon: <CommonIconFont type="bell" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'note',
    },
    {
      label: '类型配置',
      icon: <CommonIconFont type="selections" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'ProjectAffair',
    },
    {
      label: 'Kanban配置',
      icon: <CommonIconFont type="layout" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: '2',
      children: [
        {
          label: '列与状态',
          path: '/ProjectManagement/ProjectSetting',
          isPermission: true,
          key: 'ProjectKanBan',
        },
      ],
    },
    {
      label: '首页配置',
      icon: <CommonIconFont type="settings" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'ProjectHome',
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
    setSelectedKeys(['info'])
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
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  // 点击切换模块
  const onChangeRouter = (i: { path: any; key: any }) => {
    // const params = encryptPhp(JSON.stringify({ id: projectId }))
    // navigate(`${path}?data=${params}`)

    const { path, key } = i
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    if (key === 'Report') {
      const paramsData = encryptPhp(
        JSON.stringify({
          projectId: projectId,
          type: 'iteration',
          id: projectId,
        }),
      )
      navigate(`/Report/PerformanceInsight?data=${paramsData}`)
      return
    }
    navigate(`${path}?data=${params}`)
  }

  const projectSettingsClick = ({ item, key }: any) => {
    setSelectedKeys(key)
    const maps: any = {
      info: 0,
      member: 1,
      permission: 2,
      note: 3,
      ProjectAffair: 4,
      ProjectKanBan: 5,
      ProjectHome: 6,
    }
    const params = encryptPhp(
      JSON.stringify({
        type: maps[key],
        id: projectInfo.id,
        pageIdx: key,
      }),
    )
    if (key === 'ProjectAffair') {
      navigate(`${item.props.path}?data=${params}`)
      onChangeSetCategory()
      return
    }
    navigate(`${item.props.path}?data=${params}`)
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
    const key = paramsData.pageIdx
    // debugger
    if (!key) {
      projectSide.current.style.width = '100%'
      projectSetCategory.current.style.width = '0px'
      projectSetSide.current.style.width = '0'
      projectSetSide.current.style.display = 'none'
      return
    }
    if (menuKeys.includes(key)) {
      projectSide.current.style.width = '0px'
      projectSetCategory.current.style.width = '0px'
      projectSetSide.current.style.width = '100%'
      projectSetSide.current.style.display = 'block'
      return
    }
    projectSetSide.current.style.width = '0px'
    projectSetCategory.current.style.width = '100%'
    projectSide.current.style.width = '0px'
    projectSetCategory.current.style.display = 'block'
    // if (paramsData?.pageIdx) {
    //   if (projectSide.current === null) return
    //   if (projectSetCategory.current === null) return
    //   if (projectSetSide.current === null) return

    //   // 配置工作流或者是没有type的，跳转需求/迭代侧边栏
    //   if (!paramsData?.type && paramsData.pageIdx !== 'work') {
    //     debugger
    //     projectSide.current.style.width = '0px'
    //     projectSetCategory.current.style.width = '0px'
    //     projectSetSide.current.style.width = '100%'
    //     projectSetSide.current.style.display = 'block'
    //   }
    // } else {
    //   if (projectSide.current === null) return
    //   if (projectSetCategory.current === null) return
    //   if (projectSetSide.current === null) return
    //   projectSetSide.current.style.width = '0px'
    //   projectSetCategory.current.style.width = '0px'
    //   projectSide.current.style.width = '100%'
    //   setTimeout(() => {
    //     if (projectSetSide.current === null) return
    //     projectSetSide.current.style.display = 'none'
    //   }, 200)
    // }
  }, [paramsData])
  useEffect(() => {
    const key = paramsData.pageIdx === 'main' ? 'info' : paramsData.pageIdx
    setSelectedKeys([key])
  }, [])
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
              key={i.path}
              isActive={routerPath.pathname === i.path}
              onClick={() => onChangeRouter(i)}
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
          {
            <Menu
              items={sideList}
              onClick={projectSettingsClick}
              mode="inline"
              style={{ background: 'transparent' }}
              selectedKeys={selectedKeys}
            ></Menu>
          }
        </MenuBox>
      </WrapSet>

      <WrapCategory ref={projectSetCategory}>
        <DemandSettingSide onClick={onCategoryBack} onBack={onGoBack} />
      </WrapCategory>
    </AllWrap>
  )
}

export default ProjectDetailSide
