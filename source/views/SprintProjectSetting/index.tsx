// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import DemandSetting from '../DemandSetting'
import KanBanSettings from './components/KanBanSetting'
import HomeSettings from './components/HomeSetting'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector } from '@store/index'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import PermissionWrap from '@/components/PermissionWrap'
import InputSearch from '@/components/InputSearch'
import { useState, useEffect } from 'react'
import ProjectNote from './components/ProjectNote'
import CommonBreadCrumd from '@/components/CommonBreadcrumd'

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
  const { currentMenu } = useSelector(store => store.user)
  console.log('')
  const [searchValue, setSearchValue] = useState('')

  let maps = new Map([
    [
      'ProjectInfo',
      {
        name: '项目信息',
        icon: 'file-text',
        content: <ProjectInfo />,
        isPermission: true,
      },
    ],
    [
      'ProjectMember',
      {
        name: '项目成员',
        icon: 'team',
        content: <ProjectMember searchValue={searchValue} />,
        isPermission: true,
      },
    ],
    [
      'ProjectRole',
      {
        name: '项目角色',
        icon: 'lock',
        content: <ProjectSet />,
        isPermission: true,
      },
    ],
    [
      'ProjectNotify',
      {
        name: '通知配置',
        icon: 'settings',
        content: <ProjectNote />,
        isPermission: true,
      },
    ],
    [
      'ProjectKanBan',
      {
        name: 'Kanban配置',
        icon: 'settings',
        content: <KanBanSettings />,
        isPermission: true,
      },
    ],
    [
      'ProjectHome',
      {
        name: '首页配置',
        icon: 'settings',
        content: <HomeSettings />,
        isPermission: true,
      },
    ],
  ])
  useEffect(() => {
    console.log('activeTabs========', activeTabs)
  }, [activeTabs])

  return (
    <div style={{ height: '100%' }}>
      <SearchBox>
        {/* <MyBreadcrumb setName={maps.get(activeTabs)?.name} /> */}
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
  )
}

export default Setting
