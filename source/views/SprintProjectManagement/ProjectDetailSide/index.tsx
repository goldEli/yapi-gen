/* eslint-disable @typescript-eslint/padding-line-between-statements */
// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData, getProjectType } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import {
  setFilterKeys,
  setProjectInfo,
  setProjectInfoValues,
} from '@store/project'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
// import { menuList } from '../config'
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
  WrapDetail,
  WrapCategory,
} from './style'
import { clearValue, onTapSearchChoose } from '@store/view'

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
  const projectSide = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState(['ProjectInfo'])
  const projectSettingsList = [
    {
      label: t('sprintProject.projectInformation'),
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="file-text" size={18} />
      ),
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectInfo',
    },
    {
      label: t('sprintProject.projectMember'),
      icon: <CommonIconFont color="var(--neutral-n3)" type="team" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/member'),
        ).length > 0,
      key: 'ProjectMember',
    },
    {
      label: t('sprintProject.projectRole'),
      icon: <CommonIconFont color="var(--neutral-n3)" type="lock" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/role'),
        ).length > 0,
      key: 'ProjectRole',
    },
    {
      label: t('sprintProject.notificationConfiguration'),
      icon: <CommonIconFont color="var(--neutral-n3)" type="bell" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/notification'),
        ).length > 0,
      key: 'ProjectNotify',
    },
    {
      label: t('sprintProject.transactionType'),
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="selections" size={18} />
      ),
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/story_config'),
        ).length > 0,
      key: 'ProjectAffair',
    },
    {
      label: t('sprintProject.kanbanConfiguration'),
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="layout" size={18} />
      ),
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/kanban'),
        ).length > 0,
      key: '2',
      children: [
        {
          label: t('sprintProject.columnsAndStatus'),
          path: '/SprintProjectManagement/Setting',
          isPermission: true,
          key: 'ProjectKanBan',
        },
      ],
    },
    {
      label: t('sprintProject.homeConfiguration'),
      icon: (
        <CommonIconFont color="var(--neutral-n3)" type="settings" size={18} />
      ),
      path: '/SprintProjectManagement/Setting',
      isPermission:
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.identity).includes('b/project/home'),
        ).length > 0,
      key: 'ProjectHome',
    },
  ]
  const menuList = [
    {
      name: t('sprintProject.affairs'),
      icon: 'book-open',
      path: '/SprintProjectManagement/Affair',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('事务'),
        ).length,
      key: 'Affair',
    },
    {
      name: t('sprintProject.sprint'),
      icon: 'timer',
      path: '/SprintProjectManagement/Sprint',
      isPermission:
        // projectInfo?.isPublic === 1
        //   ? true
        //   :
        projectInfo?.projectPermissions?.filter((i: any) =>
          String(i.group_name).includes('冲刺'),
        ).length,
      key: 'Sprint',
    },
    {
      name: 'KanBan',
      icon: 'layout',
      path: '/SprintProjectManagement/KanBan',
      isPermission: true,
      key: 'KanBan',
    },

    {
      name: t('sprintProject.report'),
      icon: 'pie-chart-02',
      path: '/Report/PerformanceInsight',
      isPermission: true,
      key: 'SprintReport',
    },
  ]
  // 获取项目信息
  const getInfo = async () => {
    getProjectInfoValuesData()
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  //   点击项目设置
  const onSprintProjectSetting = (isInit?: boolean) => {
    setSelectedKeys(['ProjectInfo'])
    const params = encryptPhp(
      JSON.stringify({ id: projectId, pageIdx: 'main', type: 'ProjectInfo' }),
    )
    navigate(`/SprintProjectManagement/Setting?data=${params}`)
  }

  // 点击切换模块
  const onChangeRouter = (i: { path: any; key: any }) => {
    dispatch(clearValue())
    // 进入主页清除已存储的筛选计数
    dispatch(setFilterKeys([]))
    dispatch(onTapSearchChoose(''))
    const { path, key } = i
    const params = encryptPhp(JSON.stringify({ id: projectId, type: 'sprint' }))
    if (key === 'SprintReport') {
      const paramsData = encryptPhp(
        JSON.stringify({
          projectId: projectId,
          type: 'sprint',
          id: projectId,
        }),
      )
      navigate(`/Report/PerformanceInsight?data=${paramsData}`)
      return
    }
    navigate(`${path}?data=${params}`)
  }

  // 项目设计导航
  const projectSettingsClick = ({ item, key }: any) => {
    setSelectedKeys(key)
    // debugger
    const params = encryptPhp(
      JSON.stringify({
        type: key,
        id: projectId,
      }),
    )
    if (key === 'ProjectAffair') {
      navigate(`/SprintProjectManagement/DemandSetting?data=${params}`)
      return
    }
    navigate(`${item.props.path}?data=${params}`)
  }
  const onGoBack = () => {
    getInfo()
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`/SprintProjectManagement/Affair?data=${params}`)
  }
  const demandClick = () => {
    setSelectedKeys(['ProjectInfo'])
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`/SprintProjectManagement/Setting?data=${params}`)
  }

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
  }, [projectId])

  useEffect(() => {
    // debugger
    setSelectedKeys([paramsData.type])
  }, [paramsData.type])
  useEffect(() => {}, [pathname])
  return (
    <AllWrap>
      {pathname !== '/SprintProjectManagement/DemandSetting' &&
        pathname !== '/SprintProjectManagement/WorkFlow' && (
          <WrapDetail ref={projectSide}>
            <SideTop>
              <img src={projectInfo.cover} alt="" />
              <SideInfo>
                <div>{projectInfo.name}</div>
                <span>
                  {projectInfo.teamId
                    ? t('teamwork', {
                        type: projectInfo.projectType === 1 ? '迭代' : '冲刺',
                      })
                    : t('enterprise_project', {
                        type: projectInfo.projectType === 1 ? '迭代' : '冲刺',
                      })}
                </span>
              </SideInfo>
            </SideTop>
            {pathname === '/SprintProjectManagement/Setting' && (
              <Back onClick={onGoBack}>
                <CommonIconFont type="left-md" />
                <span style={{ marginLeft: '2px' }}>{t('back')}</span>
              </Back>
            )}
            <Provider />
            <MenuBox>
              {pathname === '/SprintProjectManagement/Setting' ? (
                // <div>12</div>
                <Menu
                  // expandIcon={({ isOpen }) => {
                  //   return (
                  //     <div className="custom" style={{ marginLeft: 10 }}>
                  //       {isOpen ? (
                  //         <CommonIconFont
                  //           color="var(--neutral-n3)"
                  //           type="up"
                  //           size={18}
                  //         />
                  //       ) : (
                  //         <CommonIconFont
                  //           color="var(--neutral-n3)"
                  //           type="down"
                  //           size={18}
                  //         />
                  //       )}
                  //     </div>
                  //   )
                  // }}
                  items={projectSettingsList?.filter(
                    (i: any) => i.isPermission,
                  )}
                  onClick={projectSettingsClick}
                  mode="inline"
                  style={{ background: 'transparent', border: 'none' }}
                  selectedKeys={selectedKeys}
                  defaultOpenKeys={['2']}
                ></Menu>
              ) : (
                menuList.map((i: any) => (
                  <MenuItem
                    key={i.path}
                    isActive={
                      (pathname ===
                        '/SprintProjectManagement/SprintProjectDetail' &&
                        i.path === '/SprintProjectManagement/Affair') ||
                      pathname === i.path
                    }
                    onClick={() => onChangeRouter(i)}
                    hidden={!i.isPermission}
                  >
                    <CommonIconFont
                      color="var(--neutral-n3)"
                      type={i.icon}
                      size={18}
                    />
                    <div>{i.name}</div>
                  </MenuItem>
                ))
              )}
            </MenuBox>
            {pathname !== '/SprintProjectManagement/Setting' && (
              <SideFooter onClick={() => onSprintProjectSetting(true)}>
                <div>
                  <CommonIconFont
                    type="settings"
                    color="var(--neutral-n3)"
                    size={18}
                  />
                  <div>{t('project.projectSet')}</div>
                </div>
              </SideFooter>
            )}
          </WrapDetail>
        )}
      {(pathname === '/SprintProjectManagement/DemandSetting' ||
        pathname === '/SprintProjectManagement/WorkFlow') && (
        <WrapCategory>
          <DemandSettingSide onClick={demandClick} onBack={() => {}} />
        </WrapCategory>
      )}
    </AllWrap>
  )
}

export default ProjectDetailSide
