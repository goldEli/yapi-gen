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
      icon: <CommonIconFont type="settings" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectNotify',
    },
    {
      label: '事务类型',
      icon: <CommonIconFont type="file-text" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: 'ProjectAffair',
    },
    {
      label: 'Kanban配置',
      icon: <CommonIconFont type="file-text" size={18} />,
      path: '/SprintProjectManagement/Setting',
      isPermission: true,
      key: '2',
      children: [
        {
          label: '列与状态',
          icon: <CommonIconFont type="file-text" size={18} />,
          path: '/SprintProjectManagement/Setting',
          isPermission: true,
          key: 'ProjectKanBan',
        },
      ],
    },
    {
      label: '首页配置',
      icon: <CommonIconFont type="file-text" size={18} />,
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
    console.log('projectId---', projectId)
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
  const projectSettingsClick = ({ item, key }: any) => {
    if (key === 'ProjectAffair') {
      return
    }
    const params = encryptPhp(
      JSON.stringify({
        type: key,
        id: projectId,
      }),
    )
    navigate(`${item.props.path}?data=${params}`)
  }
  const onGoBack = () => {
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`/SprintProjectManagement/KanBan?data=${params}`)
  }

  useEffect(() => {
    getInfo()
  }, [projectId])
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
        <Back onClick={onGoBack}>
          <CommonIconFont type="left-md" />
          <span style={{ marginLeft: '2px' }}>{t('back')}</span>
        </Back>
        <Provider />

        <MenuBox>
          {pathname === '/SprintProjectManagement/Setting' ? (
            <Menu
              items={projectSettingsList}
              onClick={projectSettingsClick}
              mode="inline"
              style={{ background: 'transparent' }}
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
      </WrapDetail>
    </AllWrap>
  )
}

export default ProjectDetailSide
