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
import { menuList } from '../config'
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
      label: '项目信息',
      icon: <CommonIconFont type="file-text" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectInfo',
    },
    {
      label: '项目成员',
      icon: <CommonIconFont type="team" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectMember',
    },
    {
      label: '项目角色',
      icon: <CommonIconFont type="lock" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectRole',
    },
    {
      label: '通知配置',
      icon: <CommonIconFont type="bell" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectNotify',
    },
    {
      label: '事务类型',
      icon: <CommonIconFont type="selections" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectAffair',
    },
    {
      label: 'Kanban配置',
      icon: <CommonIconFont type="layout" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: '2',
      children: [
        {
          label: '列与状态',
          path: '/SprintProjectManagement/Setting',
          isPermission: true,
          key: 'ProjectKanBan',
        },
      ],
    },
    {
      label: '首页配置',
      icon: <CommonIconFont type="settings" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectHome',
    },
  ]
  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  //   点击项目设置
  const onSprintProjectSetting = (isInit?: boolean) => {
    setSelectedKeys(['ProjectInfo'])
    const params = encryptPhp(
      JSON.stringify({ id: projectId, pageIdx: 'main', type: 0 }),
    )
    navigate(`/SprintProjectManagement/Setting?data=${params}`)
  }

  // 点击切换模块
  const onChangeRouter = (path: string) => {
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`${path}?data=${params}`)
  }

  // 项目设计导航
  const projectSettingsClick = ({ item, key }: any) => {
    setSelectedKeys(key)
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
    console.log('paramsData.type',paramsData.type)
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
                  {projectInfo.teamId ? t('teamwork') : t('enterprise_project')}
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
                <Menu
                  items={projectSettingsList}
                  onClick={projectSettingsClick}
                  mode="inline"
                  style={{ background: 'transparent' }}
                  selectedKeys={selectedKeys}
                ></Menu>
              ) : (
                menuList.map((i: any) => (
                  <MenuItem
                    key={i.path}
                    isActive={pathname === i.path}
                    onClick={() => onChangeRouter(i.path)}
                    hidden={!i.isPermission}
                  >
                    <CommonIconFont type={i.icon} size={18} />
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
