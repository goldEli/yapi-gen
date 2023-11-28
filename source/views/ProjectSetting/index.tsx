// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import ProjectInfo from './components/ProjectInfo'
import ProjectSet from './components/ProjectSet'
import KanBanSettings from './components/KanBanSetting'
import HomeSettings from './components/HomeSetting'
import WorkingTimeConfig from './components/WorkTimeConfig/index'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { useState, useEffect } from 'react'
import ProjectNote from './components/ProjectNote'
import { getProjectRoleList } from '@store/sprint/sprint.thunk'
import { HaveTabsContentWrap } from '@/components/StyleCommon'
import TabsContent from '@/components/TabsContent'
import DailyReportRules from './components/DailyReportRules'
import TypeConfiguration from '../TypeConfiguration'
import { encryptPhp } from '@/tools/cryptoPhp'
import ProjectWarning from './components/ProjectWarning/index'

const Content = styled.div({
  width: '100%',
  height: 'calc(100% - 38px)',
  background: 'var(--neutral-white-d1)',
})

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 8px 24px;
`

const Setting = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const routerPath = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { projectInfo } = useSelector(store => store.project)
  const { currentMenu } = useSelector(store => store.user)
  const [resultTabList, setResultTabList] = useState<any>()
  const [activeKey, setActiveKey] = useState<any>('info')

  //   跳转路由
  const onChangeRouter = (key: any) => {
    const url = resultTabList?.filter((i: any) => i.key === key)[0]?.url
    //   拼接三级菜单路由
    navigate(
      `${url}?data=${encryptPhp(JSON.stringify({ id: paramsData?.id }))}`,
    )
  }

  useEffect(() => {
    if (projectInfo?.id && currentMenu?.id) {
      const list = [
        {
          label: t('project.projectInformation'),
          icon: 'file-text',
          key: 'info',
          isPermission: true,
          content: <ProjectInfo />,
          url: '/ProjectDetail/Setting/ProjectInfo',
        },
        {
          label: t('project.projectPermissionGroup'),
          icon: 'lock',
          content: <ProjectSet />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/role'),
          ).length,
          key: 'permission',
          url: '/ProjectDetail/Setting/ProjectSet',
        },
        {
          label: t('notification_settings'),
          icon: 'settings',
          content: <ProjectNote />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/notification'),
          ).length,
          key: 'note',
          url: '/ProjectDetail/Setting/ProjectNote',
        },
        {
          label: t('newlyAdd.demandSet'),
          icon: 'settings',
          content: <TypeConfiguration />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/story_config'),
          ).length,
          key: 'ProjectAffair',
          url: '/ProjectDetail/Setting/TypeConfiguration',
        },
        {
          label: t('sprintProject.kanbanConfiguration'),
          icon: 'layout',
          content: <KanBanSettings />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/kanban'),
          ).length,
          key: 'ProjectKanBan',
          url: '/ProjectDetail/Setting/KanBanSettings',
        },
        {
          label: t('other.homeConfig'),
          icon: 'settings',
          content: <HomeSettings />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/home'),
          ).length,
          key: 'ProjectHome',
          url: '/ProjectDetail/Setting/HomeSettings',
        },
        {
          label: t('rbgz'),
          icon: 'settings',
          content: <DailyReportRules />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/daily_config'),
          ).length,
          key: 'ProjectSchedule',
          url: '/ProjectDetail/Setting/DailyReportRules',
        },
        {
          label: t('projectPushSettings'),
          icon: 'settings',
          content: <ProjectWarning />,
          isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
            String(i.identity).includes('b/project/warning_config'),
          ).length,
          key: 'ProjectWarning',
          url: '/ProjectDetail/Setting/ProjectWarning',
        },
        {
          label: '工作时间配置',
          icon: 'settings',
          content: <WorkingTimeConfig />,
          isPermission: true,
          key: 'WorkingTimeConfig',
          url: '/ProjectDetail/Setting/WorkingTimeConfig',
        },
      ]
      setResultTabList(list?.filter((i: any) => i.isPermission))
      // //   获取当前路由的key
      // const currentRouter = list?.filter(
      //   (i: any) => i.url === routerPath?.pathname,
      // )
      // const resultKey =
      //   currentRouter?.length > 0 ? currentRouter[0]?.key : list[0].key
      // //   拼接三级菜单路由
      // navigate(
      //   `${
      //     list?.filter((i: any) => i.key === resultKey)[0]?.url
      //   }?data=${encryptPhp(JSON.stringify({ id: paramsData?.id }))}`,
      // )
    }
  }, [projectInfo, currentMenu])

  useEffect(() => {
    //   获取当前路由的key
    const currentRouter = resultTabList?.filter(
      (i: any) => i.url === routerPath?.pathname,
    )
    const resultKey =
      currentRouter?.length > 0 ? currentRouter[0]?.key : resultTabList?.[0].key
    setActiveKey(resultKey)
  }, [routerPath])

  useEffect(() => {
    dispatch(getProjectRoleList({ project_id: paramsData.id }))
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <SearchBox>
        <MyBreadcrumb
          setName={
            resultTabList?.filter((i: any) => i.key === activeKey)[0]?.label
          }
        />
      </SearchBox>
      <HaveTabsContentWrap height="calc(100vh - 106px)">
        <TabsContent
          onChangeRouter={onChangeRouter}
          tabItems={resultTabList}
          activeKey={activeKey}
        />
        <Content>
          <Outlet />
        </Content>
      </HaveTabsContentWrap>
    </div>
  )
}

export default Setting
