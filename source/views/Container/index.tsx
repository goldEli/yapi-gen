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
  z-index: 2;
`

const Content = styled.div`
  height: calc(100vh - 56px);
  width: 100%;
  overflow: auto;
  display: flex;
  z-index: 1;
`

const Main = styled.div<{ left: number }>`
  height: 100%;
  width: ${props => `calc(100% - ${props.left}px)`};
  flex: 1;
  position: relative;
  overflow: auto;
  background: var(--neutral-white-d1);
  > div:first-child {
    height: 100%;
  }
`

export const Container = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const [changeLeft, setChangeLeft] = useState(200)
  const { userInfo, loginInfo, menuPermission } = useSelector(
    store => store.user,
  )
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
  const navigate = useNavigate()

  // 没有二级菜单的
  const notHaveSide = ['/Situation']

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
    if (
      !e.target?.parentElement?.className?.includes('canClickDetail') &&
      !e.target?.className?.includes('canClickDetail') &&
      storeAll.getState().demand.isDemandDetailDrawerVisible
    ) {
      dispatch({
        type: 'demand/setIsDemandDetailDrawerVisible',
        payload: false,
      })
      dispatch({
        type: 'demand/setDemandDetailDrawerProps',
        payload: {},
      })
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
      navigate(menuPermission.priorityUrl)
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
            {location.pathname !== '/Situation' && getSide() && (
              <Side onChangeLeft={setChangeLeft} />
            )}
            <Main left={changeLeft}>
              <Outlet />
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
      </ConfigProvider>
    </KitConfigProvider>
  )
}
