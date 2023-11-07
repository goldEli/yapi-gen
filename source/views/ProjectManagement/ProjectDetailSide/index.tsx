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
import { Menu } from 'antd'
import { setHeaderParmas, setSave } from '@store/performanceInsight'
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
  SettingMenu,
} from './style'
export const MenuStyle = styled(Menu)`
  svg {
    color: var(--neutral-n3);
  }
  .ant-menu-item:hover {
    color: var(--primary-d2) !important;
    svg {
      color: var(--primary-d2) !important;
    }
  }
  .ant-menu-item-selected,
  .ant-menu-submenu-selected {
    svg {
      color: var(--primary-d2) !important;
    }
    background: linear-gradient(
      90deg,
      #ebefff 0%,
      rgba(243, 246, 255, 0) 100%
    ) !important;
    color: var(--primary-d2) !important;
    .ant-menu-submenu-arrow {
      color: var(--primary-d2) !important;
    }
  }
  .ant-menu-submenu-selected {
    background: transparent !important;
  }
  .ant-menu-item-selected::after {
    border-right: 0;
  }
  .ant-menu-submenu-title {
    &:hover {
      svg {
        color: var(--primary-d2) !important;
      }
      color: var(--primary-d2) !important;
    }
  }
`
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
  const [selectedKeys, setSelectedKeys] = useState(['ProjectInfo'])
  const routerPath = useLocation()
  const navigate = useNavigate()
  let menuList = [
    {
      name: t('demand'),
      icon: 'demand',
      path: '/ProjectManagement/Demand',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('需求'),
        ).length,
    },
    {
      name: t('iteration'),
      icon: 'interation-2',
      path: '/ProjectManagement/Iteration',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('迭代'),
        ).length,
    },
    {
      name: t('panel'),
      icon: 'layout',
      path: '/ProjectManagement/KanBan',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('Kanban'),
        ).length > 0,
    },
    {
      name: t('version2.report'),
      icon: 'pie-chart-02',
      path: '/Report/PerformanceInsight',
      isPermission: true,
      key: 'Report',
    },
    {
      name: t('sprintProject.defect'),
      icon: 'bug',
      path: '/ProjectManagement/Defect',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('缺陷'),
        ).length,
    },
    {
      name: t('workingHoursStatistics'),
      icon: 'man-hour',
      path: '/ProjectManagement/WorkHours',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
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
    'ProjectSchedule',
    'ProjectWarning',
  ]
  const sideList = [
    {
      label: t('sprintProject.projectInformation'),
      icon: <CommonIconFont type="file-text" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'info',
    },
    {
      label: t('sprintProject.projectMember'),
      icon: <CommonIconFont type="team" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/member'),
        ).length > 0,
      key: 'member',
    },
    {
      label: t('sprintProject.projectRole'),
      icon: <CommonIconFont type="lock" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/role'),
        ).length > 0,
      key: 'permission',
    },
    {
      label: t('sprintProject.notificationConfiguration'),
      icon: <CommonIconFont type="bell" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/notification'),
        ).length > 0,
      key: 'note',
    },
    {
      label: t('sprintProject.typeConfiguration'),
      icon: <CommonIconFont type="selections" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/story_config'),
        ).length > 0,
      key: 'ProjectAffair',
    },
    {
      label: t('sprintProject.kanbanConfiguration'),
      icon: <CommonIconFont type="layout" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/kanban'),
        ).length > 0,
      key: '2',
      children: [
        {
          label: t('sprintProject.columnsAndStatus'),
          path: '/ProjectManagement/ProjectSetting',
          isPermission:
            projectInfo?.projectPermissions?.filter((i: any) =>
              String(i.identity).includes('b/project/kanban'),
            ).length > 0,
          key: 'ProjectKanBan',
        },
      ],
    },
    {
      label: t('sprintProject.homeConfiguration'),
      icon: <CommonIconFont type="settings" size={18} />,
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/home'),
        ).length > 0,
      key: 'ProjectHome',
    },
    {
      label: t('rbgz'),
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="log-nor" size={18} />
      ),
      path: '/ProjectManagement/ProjectSetting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/daily_config'),
        ).length > 0,
      key: 'ProjectSchedule',
    },
    {
      label: '项目预警设置',
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="log-nor" size={18} />
      ),
      path: '/ProjectManagement/ProjectSetting',
      isPermission: true,
      key: 'ProjectWarning',
    },
  ]
  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId }, 1)
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    getProjectInfoValuesData()
    const result = await getProjectInfo({
      projectId,
      isBug: location.pathname.includes('/Defect') ? 1 : 2,
    })
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
    if ([0, 1, 2].includes(paramsData?.type)) {
      onChangeSet()
    }
    if (paramsData?.type === 3 || paramsData?.pageIdx === 'work') {
      onChangeSetCategory()
    }
  }, [projectId])

  //   返回上一页
  const onGoBack = () => {
    getInfo()
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = '100%'
    const params = encryptPhp(
      JSON.stringify({ id: projectId, type: 'iteration' }),
    )
    navigate(`/ProjectManagement/Demand?data=${params}`)
    setTimeout(() => {
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  // 点击切换模块
  const onChangeRouter = (i: { path: any; key: any }) => {
    // const params = encryptPhp(JSON.stringify({ id: projectId }))
    // navigate(`${path}?data=${params}`)
    dispatch(
      setHeaderParmas({
        iterate_ids: [],
        projectIds: [],
        users: [],
        time: {
          type: 1,
          time: '',
        },
        view: {
          title: '',
          value: 0,
        },
        period_time: 'one_month',
      }),
    )
    dispatch(setSave(false))
    const { path, key } = i
    const params = encryptPhp(
      JSON.stringify({ id: projectId, type: 'iteration' }),
    )
    getInfo()

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
      ProjectSchedule: 7,
      ProjectWarning: 8,
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
    projectSide.current.style.width = '0px'
    projectSetCategory.current.style.width = '100%'
    projectSetCategory.current.style.display = 'block'
    // if (paramsData?.pageIdx) {
    //   if (projectSide.current === null) return
    //   if (projectSetCategory.current === null) return
    //   if (projectSetSide.current === null) return

    //   // 配置工作流或者是没有type的，跳转需求/迭代侧边栏
    //   if (!paramsData?.type && paramsData.pageIdx !== 'work') {

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
  }, [paramsData.pageIdx])
  return (
    <AllWrap>
      <WrapDetail ref={projectSide}>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div style={{ fontFamily: 'SiYuanMedium' }}>{projectInfo.name}</div>
            <span>
              {projectInfo.teamId
                ? t('teamwork', {
                    type:
                      projectInfo.projectType === 1
                        ? t('sprintProject.iteration')
                        : t('sprintProject.sprint'),
                  })
                : t('enterprise_project', {
                    type:
                      projectInfo.projectType === 1
                        ? t('sprintProject.iteration')
                        : t('sprintProject.sprint'),
                  })}
            </span>
          </SideInfo>
        </SideTop>
        <Provider />
        <MenuBox>
          {menuList.map((i: any) => (
            <MenuItem
              key={i.path}
              // isActive={routerPath.pathname === i.path}
              isActive={
                (routerPath.pathname === '/ProjectManagement/DemandDetail' &&
                  i.path === '/ProjectManagement/Demand') ||
                (routerPath.pathname === '/ProjectManagement/IterationDetail' &&
                  i.path === '/ProjectManagement/Iteration') ||
                (routerPath.pathname === '/ProjectManagement/DefectDetail' &&
                  i.path === '/ProjectManagement/Defect') ||
                routerPath.pathname === i.path
              }
              onClick={() => onChangeRouter(i)}
              hidden={!i.isPermission}
            >
              <CommonIconFont
                type={i.icon}
                size={18}
                color="var(--neutral-n3)"
              />
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
            <div style={{ fontFamily: 'SiYuanMedium' }}>{projectInfo.name}</div>
            <span>
              {projectInfo.teamId
                ? t('teamwork', {
                    type:
                      projectInfo.projectType === 1
                        ? t('sprintProject.iteration')
                        : t('sprintProject.sprint'),
                  })
                : t('enterprise_project', {
                    type:
                      projectInfo.projectType === 1
                        ? t('sprintProject.iteration')
                        : t('sprintProject.sprint'),
                  })}
            </span>
          </SideInfo>
        </SideTop>
        <Back onClick={onGoBack}>
          <CommonIconFont size={18} type="left-md" />
          <span style={{ marginLeft: '2px', fontSize: 14 }}>{t('back')}</span>
        </Back>
        <Provider />
        <MenuBox>
          {
            <MenuStyle
              items={sideList?.filter((i: any) => i.isPermission)}
              onClick={projectSettingsClick}
              mode="inline"
              style={{ background: 'transparent', border: 'none' }}
              selectedKeys={selectedKeys}
              defaultOpenKeys={['2']}
            ></MenuStyle>
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
