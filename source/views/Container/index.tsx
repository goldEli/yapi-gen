/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { changeLanguage, loadedAntdLocals } from '@/locals'
import { login } from '@/services/user'
import { getAsyncCompanyInfo } from '@store/companyInfo'
import { useDispatch, useSelector } from '@store/index'
import { getStatus } from '@store/waterState'
import { message, ConfigProvider } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { ConfigProvider as KitConfigProvider } from '@xyfe/uikit'
import NoPermission from './components/NoPermission'
import styled from '@emotion/styled'
import Side from './components/Side'
import { getLoginDetail } from '@store/user/user.thunk'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import GlobalStyle from '@/components/GlobalStyle'
import Guide from './components/Guide'
import { getProjectCover } from '@store/cover/thunks'
import CreateViewPort from '@/components/CreateViewPort'
import CreateAProjectForm from '@/components/CreateAProjectForm'
import ManageView from '@/components/ManageView'
import CreateIteration from '@/components/CreateIteration'
import CreateDemand from '@/components/CreateDemand'

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

const Main = styled.div`
  height: 100%;
  width: calc(100% - 200px);
  flex: 1;
  position: relative;
`

export const Container = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const { userInfo, loginInfo } = useSelector(store => store.user)
  const { currentMenu } = useSelector(store => store.global)
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]

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

  useEffect(() => {
    dispatch(getProjectCover())
    dispatch(getStatus())
    dispatch(getLoginDetail())
    dispatch(getAsyncCompanyInfo())
  }, [])

  useEffect(() => {
    const languageParams =
      (localStorage.getItem('language') as 'zh' | 'en') ||
      ((new URLSearchParams(location.search).get('language') || 'zh') as
        | 'zh'
        | 'en')
    localStorage.setItem('language', languageParams)
    changeLanguage(languageParams)

    init()
  }, [])

  useEffect(() => {
    setIsNextVisible(loginInfo.admin_first_login)
  }, [loginInfo])

  return (
    <KitConfigProvider local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        <GlobalStyle />
        {userInfo?.company_permissions?.length > 0 && (
          <LayoutWrap>
            <HeaderWrap>
              <HeaderLeft />
              <HeaderRight />
            </HeaderWrap>
            <Content>
              {!notHaveSide.includes(currentMenu.url) && <Side />}
              <Main>
                <Outlet />
              </Main>
            </Content>
            <Guide
              visible={isNextVisible}
              close={() => setIsNextVisible(false)}
            />
          </LayoutWrap>
        )}
        {userInfo?.company_permissions?.length <= 0 && <NoPermission />}
        <CreateViewPort />
        <CreateAProjectForm />
        <ManageView />
        <CreateIteration />
        <CreateDemand />
      </ConfigProvider>
    </KitConfigProvider>
  )
}
