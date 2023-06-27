// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import KanBanSettings from './components/KanBanSetting'
import HomeSettings from './components/HomeSetting'
import DemandSetting from '../DemandSetting'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector, useDispatch } from '@store/index'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import PermissionWrap from '@/components/PermissionWrap'
import InputSearch from '@/components/InputSearch'
import { useState, useEffect } from 'react'
import ProjectNote from './components/ProjectNote'
import { getProjectRoleList } from '@store/sprint/sprint.thunk'
const Wrap = styled.div({
  display: 'flex',
  height: 'calc(100vh - 130px)',
})

const Content = styled.div({
  width: '100%',
  height: '100%',
})

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 20px 24px 20px 24px;
`

const Setting = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0
  const { currentMenu } = useSelector(store => store.user)
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const SideList = [
    {
      name: t('project.projectInformation'),
      icon: 'file-text',
      content: <ProjectInfo />,
      isPermission: true,
    },
    {
      name: t('project.projectMember'),
      icon: 'team',
      content: <ProjectMember searchValue={searchValue} />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/member'),
      ).length,
    },
    {
      name: t('project.projectPermissionGroup'),
      icon: 'lock',
      content: <ProjectSet />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/role'),
      ).length,
    },
    {
      name: t('notification_settings'),
      icon: 'settings',
      content: <ProjectNote />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/notification'),
      ).length,
    },
    {
      name: t('newlyAdd.demandSet'),
      icon: 'settings',
      content: <DemandSetting />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/story_config'),
      ).length,
    },
    {
      name: 'Kanban配置',
      icon: 'settings',
      content: <KanBanSettings />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/kanban'),
      ).length,
    },
    {
      name: '首页配置',
      icon: 'settings',
      content: <HomeSettings />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/home'),
      ).length,
    },
  ]
  useEffect(() => {
    setSearchValue('')
    // console.log('activeTabs----', activeTabs, currentMenu?.children)
  }, [activeTabs])
  useEffect(() => {
    dispatch(getProjectRoleList({ project_id: paramsData.id }))
  }, [])
  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <div style={{ height: '100%' }}>
        <SearchBox>
          <MyBreadcrumb setName={SideList[activeTabs].name} />
          {activeTabs === 1 && (
            <div>
              <InputSearch
                onChangeSearch={setSearchValue}
                placeholder={t('project.pleaseNickname')}
                leftIcon
              />
            </div>
          )}
        </SearchBox>
        <Wrap>
          <Content>{SideList[activeTabs].content}</Content>
        </Wrap>
      </div>
    </PermissionWrap>
  )
}

export default Setting
