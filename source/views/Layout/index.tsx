import CreateAProjectForm from '@/components/CreateAProjectForm'
import CreateIteration from '@/components/CreateIteration'
import DemandDetailDrawer from '@/components/DemandDetailDrawer'
import GlobalStyle from '@/components/GlobalStyle'
import { changeLanguage, loadedAntdLocals } from '@/locals'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { ConfigProvider, Popover, Tooltip, message } from 'antd'
import { ConfigProvider as KitConfigProvider } from 'ifunuikit'
import { useTranslation } from 'react-i18next'
import ReportDetailDrawer from '../WorkReport/Review/components/ReportDetailDrawer'
import UserSystemReport from '../WorkReport/Review/components/UserSystemReport'
import ProjectSystemReport from '../WorkReport/Review/components/ProjectSystemReport'
import SiteDrawer from '../SiteNotifications/components/SiteDrawer/SiteDrawer'
import AddWorkItem from '@/components/AddWorkItem'
import SprintDetailDrawer from '@/components/SprintDetailDrawer'
import FlawDetailDrawer from '@/components/FlawDetailDrawer'
import DetailScreenModal from '@/components/DetailScreenModal'
import EmployeeProfileContrast from '@/components/EmployeeProfileContrast'
import DeleteConfirmGlobalModal from '@/components/DeleteConfirmGlobal'
import ReportAssistantModal from '../WorkReport/Review/components/ReportAssistantModal'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/services/user'
import { setAffairsDetailDrawer } from '@store/affairs'
import { setFlawDetailDrawer } from '@store/flaw'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import { saveFlawDetailDrawer } from '@store/flaw/flaw.thunk'
import { getStatus } from '@store/waterState'
import { getProjectCover } from '@store/cover/thunks'
import { getLoginDetail } from '@store/user/user.thunk'
import { getAsyncCompanyInfo } from '@store/companyInfo'
import {
  CollapseWrap,
  LayoutContent,
  LayoutHeader,
  LayoutSide,
  LayoutWrap,
  MainContent,
  CollapseWrapItem,
  LogoWrap,
  notOpenSideMenu,
  openSideMenu,
  MorePopover,
} from './style'
import Guide from './components/Guide'
import { changeCreateVisible } from '@store/create-propject'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import { changeFreedVisibleVisible } from '@store/feedback'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { setLayoutSideCollapse } from '@store/global'

const data = {
  menus: [
    {
      id: 603,
      name: '项目',
      url: '/Project',
      permission: 'b/project',
      p_menu: '',
      status: 1,
      created_at: '-0001-11-30 00:00:00',
      updated_at: '2023-08-07 23:56:41',
    },

    {
      id: 616,
      name: '汇报',
      url: '/Report',
      permission: 'b/work_report',
      p_menu: '',
      status: 1,
      created_at: '-0001-11-30 00:00:00',
      updated_at: '2023-08-07 23:56:41',
      children: [
        {
          id: 617,
          name: '汇报',
          url: '/Report/Review',
          permission: 'b/work_report/list',
          p_menu: '\u5de5\u4f5c\u6c47\u62a5',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 618,
          name: '统计',
          url: '/Report/Statistics',
          permission: 'b/work_report/statistics',
          p_menu: '\u5de5\u4f5c\u6c47\u62a5',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 619,
          name: '模板',
          url: '/Report/Formwork',
          permission: 'b/work_report/template',
          p_menu: '\u5de5\u4f5c\u6c47\u62a5',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
      ],
    },
    {
      id: 614,
      name: '日程',
      url: '/CalendarManager',
      permission: 'b/calendar',
      p_menu: '',
      status: 1,
      created_at: '-0001-11-30 00:00:00',
      updated_at: '2023-08-07 23:56:41',
      children: [],
    },
    {
      id: 642,
      name: '人员',
      url: '/EmployeeProfile',
      permission: 'b/member_overview',
      p_menu: '',
      status: 1,
      created_at: '2023-09-04 10:25:46',
      updated_at: '2023-09-04 11:15:06',
      children: [],
    },
    {
      id: 602,
      name: '统计',
      url: '/Statistics',
      permission: '',
      p_menu: '',
      status: 1,
      created_at: '-0001-11-30 00:00:00',
      updated_at: '2023-08-07 23:56:41',
      children: [
        {
          id: 604,
          name: '任务',
          url: '',
          permission: 'b/project',
          p_menu: '\u9879\u76ee\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 605,
          name: '公司',
          url: '',
          permission: '',
          p_menu: '\u9879\u76ee\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
      ],
    },
    {
      id: 606,
      name: '后台',
      url: '/AdminManagement',
      permission: '',
      p_menu: '',
      status: 1,
      created_at: '-0001-11-30 00:00:00',
      updated_at: '2023-08-07 23:56:41',
      children: [
        {
          id: 607,
          name: '公司信息',
          url: '/AdminManagement/CompanyInfo',
          permission: 'b/company/info',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 608,
          name: '员工管理',
          url: '/AdminManagement/StaffManagement',
          permission: 'b/companyuser/list',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 609,
          name: '团队管理',
          url: '/AdminManagement/TeamManagement',
          permission: 'b/company/teams',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 610,
          name: '权限管理',
          url: '/AdminManagement/PermissionManagement',
          permission: 'b/company/role',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 611,
          name: '水印管理',
          url: '/AdminManagement/WaterMarkManagement',
          permission: 'b/company/config',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 612,
          name: '操作管理',
          url: '/AdminManagement/OperationManagement',
          permission: 'b/company/operate_logs',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 613,
          name: '登录管理',
          url: '/AdminManagement/LoginManagement',
          permission: 'b/company/login_logs',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
        {
          id: 621,
          name: '系统公告',
          url: '/AdminManagement/NoteManagement',
          permission: 'b/sys_notice',
          p_menu: '\u540e\u53f0\u7ba1\u7406',
          status: 1,
          created_at: '-0001-11-30 00:00:00',
          updated_at: '2023-08-07 23:56:41',
        },
      ],
    },
  ],
  priority_url: '/Project',
  help_document_path: '',
}

const LayoutIndex = () => {
  const [t] = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
  const language1 = useSelector(store => store.global.language)
  const { layoutSideCollapse } = useSelector(store => store.global)
  const { viewReportModal } = useSelector(store => store.workReport)
  const { loginInfo, menuPermission, menuIconList } = useSelector(
    store => store.user,
  )
  const { projectInfo } = useSelector(store => store.project)

  const [isNextVisible, setIsNextVisible] = useState(false)
  const [reportAssistantModalObj, setReportAssistantModalObj] = useState<{
    visible: boolean
    type: 'user' | 'project'
  }>({
    visible: false,
    type: 'user',
  })

  message.config({
    duration: 0.8,
    maxCount: 1,
  })

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
      await login()
    }
  }

  // 切换展开折叠
  const onChangeCollapse = () => {
    setTimeout(() => {
      dispatch(setLayoutSideCollapse(!layoutSideCollapse))
    }, 100)
  }

  // 关闭浮层类
  const onCloseDemandDetail = (e: any) => {
    if (
      !storeAll.getState().demand.isDemandDetailDrawerVisible &&
      !storeAll.getState().affairs.affairsDetailDrawer.visible &&
      !storeAll.getState().flaw.flawDetailDrawer.visible
    ) {
      return
    }
    if (
      typeof e.target?.parentElement?.className !== 'string' ||
      typeof e.target?.className !== 'string' ||
      (!e.target?.parentElement?.className?.includes('canClickDetail') &&
        !e.target?.className?.includes('canClickDetail') &&
        (!storeAll.getState().demand.isDemandDetailDrawerVisible ||
          !storeAll.getState().affairs.affairsDetailDrawer.visible ||
          !storeAll.getState().flaw.flawDetailDrawer.visible))
    ) {
      dispatch({
        type: 'demand/setIsDemandDetailDrawerVisible',
        payload: false,
      })
      dispatch(setAffairsDetailDrawer({ visible: false, params: {} }))
      dispatch(setFlawDetailDrawer({ visible: false, params: {} }))
      dispatch(saveDemandDetailDrawer({}))
      dispatch(saveAffairsDetailDrawer({}))
      dispatch(saveFlawDetailDrawer({}))
    }
  }

  useEffect(() => {
    document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
    return document
      .getElementById('layoutWrap')
      ?.addEventListener('click', onCloseDemandDetail)
  }, [document.getElementById('layoutWrap')])

  useEffect(() => {
    const languageParams =
      (localStorage.getItem('language') as 'zh' | 'en') ||
      ((new URLSearchParams(location.search).get('language') || 'zh') as
        | 'zh'
        | 'en')
    localStorage.setItem('language', languageParams)
    changeLanguage(languageParams)
    init()
    dispatch(getStatus())
    dispatch(getProjectCover())
    dispatch(getLoginDetail())
    dispatch(getAsyncCompanyInfo())
  }, [])

  useEffect(() => {
    // 如果没带路由则跳转优先路由
    if (location.pathname === '/') {
      // let navigateUrl = menuPermission.priorityUrl
      // // 如果是项目管理
      // if (menuPermission.priorityUrl === '/ProjectManagement') {
      //   const currentObject = menuPermission?.menus?.filter(
      //     (i: any) => i.url === '/ProjectManagement',
      //   )?.[0]
      //   const firstUrl = currentObject?.children?.[0]?.url
      //   if (firstUrl === '/ProjectManagement/Mine') {
      //     navigateUrl = '/ProjectManagement/Mine/Profile'
      //   } else {
      //     navigateUrl = firstUrl
      //   }
      // } else if (menuPermission.priorityUrl === '/AdminManagement') {
      //   const children = menuPermission?.menus?.filter(
      //     (i: any) => i.url === '/AdminManagement',
      //   )
      //   navigateUrl = children?.[0]?.url
      // }
      // if (!navigateUrl) {
      //   navigate('/ProjectManagement/Project')
      //   return
      // }
      // navigate(navigateUrl)
    }
    setIsNextVisible(loginInfo.admin_first_login)
  }, [loginInfo, menuPermission])

  const otherMenu: any = [
    { name: '动态', url: '/Trends' },
    { name: '我的', url: '/Mine' },
  ]

  return (
    <KitConfigProvider language={language1 === 'en'} local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        <GlobalStyle />

        <LayoutWrap id="layoutWrap">
          <LayoutSide isOpen={layoutSideCollapse}>
            <LogoWrap />
            {data.menus
              ?.filter((k: any) => k.url !== '/AdminManagement')
              .concat(otherMenu)
              ?.map((i: any) => (
                <div
                  key={i.id}
                  className={
                    layoutSideCollapse ? openSideMenu : notOpenSideMenu
                  }
                >
                  <CommonIconFont
                    type={
                      menuIconList?.filter((k: any) =>
                        String(i.url).includes(k.key),
                      )[0]?.normal
                    }
                    size={24}
                  />
                  <div>{i.name}</div>
                </div>
              ))}
            <Popover
              placement="right"
              destroyTooltipOnHide
              content={<MorePopover>12</MorePopover>}
            >
              <div
                className={layoutSideCollapse ? openSideMenu : notOpenSideMenu}
              >
                <CommonIconFont type="package-nor" size={24} />
                <div>更多</div>
              </div>
            </Popover>
            <CollapseWrap>
              {layoutSideCollapse && (
                <CollapseWrapItem onClick={onChangeCollapse}>
                  <CommonIconFont
                    type={layoutSideCollapse ? 'outdent' : 'indent'}
                    size={20}
                  />
                  <div>{layoutSideCollapse ? t('fold') : t('expand')}</div>
                </CollapseWrapItem>
              )}
              {!layoutSideCollapse && (
                <Tooltip title={layoutSideCollapse ? t('fold') : t('expand')}>
                  <CloseWrap width={32} height={32} onClick={onChangeCollapse}>
                    <CommonIconFont
                      type={layoutSideCollapse ? 'outdent' : 'indent'}
                      size={20}
                    />
                  </CloseWrap>
                </Tooltip>
              )}
            </CollapseWrap>
          </LayoutSide>
          <LayoutContent isOpen={layoutSideCollapse}>
            <LayoutHeader
              onClick={() => {
                dispatch(changeCreateVisible(false))
                dispatch(saveScreenDetailModal({ visible: false, params: {} }))
                closeScreenModal()
                dispatch(changeFreedVisibleVisible(false))
              }}
            ></LayoutHeader>
            <MainContent>
              <Outlet />
            </MainContent>
          </LayoutContent>
          {/* 引导页 */}
          <Guide
            visible={isNextVisible}
            close={() => setIsNextVisible(false)}
          />
        </LayoutWrap>

        {/* 一些全局的组件 */}
        <DeleteConfirmGlobalModal />
        <ReportAssistantModal
          close={() => {
            setReportAssistantModalObj({
              ...reportAssistantModalObj,
              visible: false,
            })
          }}
          projectId={
            !window.location.href.includes('/Report') ||
            window.location.href.includes('/Report/PerformanceInsight')
              ? projectInfo?.id
              : null
          }
          visible={reportAssistantModalObj.visible}
          type={reportAssistantModalObj.type}
        />
        <CreateAProjectForm />
        <CreateIteration />
        <DemandDetailDrawer />
        {viewReportModal.type === 1 ? <ReportDetailDrawer /> : null}
        {viewReportModal.type === 2 ? <UserSystemReport /> : null}
        {viewReportModal.type === 3 ? <ProjectSystemReport /> : null}
        <SiteDrawer />
        <AddWorkItem />
        <SprintDetailDrawer />
        <FlawDetailDrawer />
        <DetailScreenModal />
        <EmployeeProfileContrast />
      </ConfigProvider>
    </KitConfigProvider>
  )
}

export default LayoutIndex
