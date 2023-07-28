// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
// import KanBanSettings from './components/KanBanSetting'
import KanBanSettings from '@/views/ProjectSetting/components/KanBanSetting'
import HomeSettings from './components/HomeSetting'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector, useDispatch } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import InputSearch from '@/components/InputSearch'
import { useState, useEffect } from 'react'
import ProjectNote from './components/ProjectNote'
import CommonBreadCrumd from '@/components/CommonBreadcrumd'
import { getProjectRoleList } from '@store/sprint/sprint.thunk'
import DailyReportRules from './components/DailyReportRules'
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
  const activeTabs = paramsData.type || 'ProjectInfo'
  console.log(activeTabs, 'activeTabs')
  const { currentMenu } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')

  let maps = new Map([
    [
      'ProjectInfo',
      {
        name: t('sprintProject.projectInformation'),
        icon: 'file-text',
        content: <ProjectInfo />,
        isPermission: true,
      },
    ],
    [
      'ProjectMember',
      {
        name: t('project.projectMember'),
        icon: 'team',
        content: <ProjectMember searchValue={searchValue} />,
        isPermission: true,
      },
    ],
    [
      'ProjectRole',
      {
        name: t('sprintProject.projectRole'),
        icon: 'lock',
        content: <ProjectSet />,
        isPermission: true,
      },
    ],
    [
      'ProjectNotify',
      {
        name: t('sprintProject.notificationConfiguration'),
        icon: 'settings',
        content: <ProjectNote />,
        isPermission: true,
      },
    ],
    [
      'ProjectKanBan',
      {
        name: t('other.kanbanConfig'),
        icon: 'settings',
        content: <KanBanSettings />,
        isPermission: true,
      },
    ],
    [
      'ProjectHome',
      {
        name: t('other.homeConfig'),
        icon: 'settings',
        content: <HomeSettings />,
        isPermission: true,
      },
    ],
    [
      'ProjectSchedule',
      {
        name: '日程',
        icon: 'settings',
        content: <DailyReportRules />,
        isPermission: true,
      },
    ],
  ])
  console.log(maps, 'maps')
  useEffect(() => {
    setSearchValue('')
    console.log('activeTabs------', activeTabs)
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
          <CommonBreadCrumd></CommonBreadCrumd>
          {activeTabs === 'ProjectMember' && (
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
          <Content>{maps.get(activeTabs)?.content}</Content>
        </Wrap>
      </div>
    </PermissionWrap>
  )
}

export default Setting
