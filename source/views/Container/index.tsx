/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { changeLanguage, loadedAntdLocals } from '@/locals'
import { login } from '@/services/user'
import { getAsyncCompanyInfo } from '@store/companyInfo'
import { useDispatch, useSelector, store as storeAll } from '@store/index'
import { getStatus } from '@store/waterState'
import { message, ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ConfigProvider as KitConfigProvider } from '@xyfe/uikit'
import styled from '@emotion/styled'
import Side from './components/Side'
import { getLoginDetail } from '@store/user/user.thunk'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import GlobalStyle from '@/components/GlobalStyle'
import Guide from './components/Guide'
import { getProjectCover } from '@store/cover/thunks'
import CreateAProjectForm from '@/components/CreateAProjectForm'
import CreateIteration from '@/components/CreateIteration'
import CreateDemand from '@/components/CreateDemand'
import DemandDetailDrawer from '@/components/DemandDetailDrawer'
import SiteDrawer from '../SiteNotifications/components/SiteDrawer/SiteDrawer'
import ReportDetailDrawer from '../WorkReport/Review/components/ReportDetailDrawer'
import { saveDemandDetailDrawer } from '@store/demand/demand.thunk'

const LayoutWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const HeaderWrap = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0px 1px 9px 0px rgba(20, 37, 98, 0.05);
  background: var(--neutral-white-d2);
  z-index: 200;
  min-width: 1440px;
`

export const Content = styled.div`
  height: calc(100vh - 56px);
  width: 100%;
  overflow: auto;
  display: flex;
  /* z-index: 1; */
`

const Main = styled.div<{ left: number }>`
  height: 100%;
  width: ${props => `calc(100% - ${props.left}px)`};
  flex: 1;
  position: relative;
  background: var(--neutral-white-d1);
  overflow-x: auto;
  overflow-y: hidden;
  > div:first-child {
    height: 100%;
  }
`
const NONE_SIDE_PATH = ['/Situation', '/Report/Statistics', '/CalendarManager']

export const Container = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const [changeLeft, setChangeLeft] = useState(200)
  const { userInfo, loginInfo, menuPermission } = useSelector(
    store => store.user,
  )
  const { firstMenuCollapse } = useSelector(store => store.global)
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
  const navigate = useNavigate()

  message.config({
    duration: 0.8,
    maxCount: 1,
  })

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
      await login()
    }
  }

  const onCloseDemandDetail = (e: any) => {
    if (!storeAll.getState().demand.isDemandDetailDrawerVisible) {
      return
    }
    if (
      typeof e.target?.parentElement?.className !== 'string' ||
      typeof e.target?.className !== 'string' ||
      (!e.target?.parentElement?.className?.includes('canClickDetail') &&
        !e.target?.className?.includes('canClickDetail') &&
        storeAll.getState().demand.isDemandDetailDrawerVisible)
    ) {
      dispatch({
        type: 'demand/setIsDemandDetailDrawerVisible',
        payload: false,
      })
      dispatch(saveDemandDetailDrawer({}))
    }
  }

  const getSide = () => {
    let hasPermission

    // 是否是公司成员详情
    const isStaffMemberInfo =
      String(location.pathname).includes('/MemberInfo') &&
      !String(location.pathname).includes('/ProjectManagement')

    if (isStaffMemberInfo) {
      hasPermission = userInfo?.company_permissions?.filter(
        (i: any) => i.identity === 'b/companyuser/info',
      )?.length
    } else if (
      String(location.pathname).includes('/ProjectManagement') &&
      !String(location.pathname).includes('/ProjectManagement/Mine')
    ) {
      // 判断项目列表是否有权限
      hasPermission = menuPermission?.menus
        ?.filter((l: any) => l.url === '/ProjectManagement')?.[0]
        ?.children?.filter(
          (i: any) => i.url === '/ProjectManagement/Project',
        )?.length
    } else {
      hasPermission = menuPermission?.menus?.filter((l: any) =>
        location.pathname.includes(l.url),
      )?.length
    }
    return hasPermission > 0
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
    dispatch(getLoginDetail())
    dispatch(getAsyncCompanyInfo())
    dispatch(getProjectCover())
  }, [])

  useEffect(() => {
    // 如果没带路由则跳转优先路由
    if (location.pathname === '/') {
      let navigateUrl = menuPermission.priorityUrl
      // 如果是项目管理
      if (menuPermission.priorityUrl === '/ProjectManagement') {
        const currentObject = menuPermission?.menus?.filter(
          (i: any) => i.url === '/ProjectManagement',
        )?.[0]

        const firstUrl = currentObject?.children?.[0]?.url
        if (firstUrl === '/ProjectManagement/Mine') {
          navigateUrl = '/ProjectManagement/Mine/Profile'
        } else {
          navigateUrl = firstUrl
        }
      } else if (menuPermission.priorityUrl === '/LogManagement') {
        // 如果是日志
        navigateUrl = '/LogManagement/Send/1'
      } else if (menuPermission.priorityUrl === '/AdminManagement') {
        const children = menuPermission?.menus?.filter(
          (i: any) => i.url === '/AdminManagement',
        )
        navigateUrl = children?.[0]?.url
      }
      navigate(navigateUrl)
    }
    setIsNextVisible(loginInfo.admin_first_login)
  }, [loginInfo, menuPermission])

  return (
    <KitConfigProvider local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        <GlobalStyle />

        <LayoutWrap id="layoutWrap">
          <HeaderWrap>
            <HeaderLeft />
            <HeaderRight />
          </HeaderWrap>
          <Content>
            {!NONE_SIDE_PATH.includes(location.pathname) && getSide() && (
              <Side onChangeLeft={setChangeLeft} />
            )}
            <Main left={changeLeft}>
              <div
                style={{
                  height: '100%',
                  minWidth: `${1440 - (firstMenuCollapse ? changeLeft : 0)}px`,
                }}
              >
                <Outlet />
              </div>
            </Main>
          </Content>
          <Guide
            visible={isNextVisible}
            close={() => setIsNextVisible(false)}
          />
        </LayoutWrap>

        <CreateAProjectForm />
        <CreateIteration />
        <CreateDemand />
        <DemandDetailDrawer />
        <ReportDetailDrawer />
        <SiteDrawer />
      </ConfigProvider>
    </KitConfigProvider>
  )
}
