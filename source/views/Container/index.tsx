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
import Next from './components/Next'
import styled from '@emotion/styled'
import Side from './components/Side'
import { getLoginDetail } from '@store/user/user.thunk'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import FoldIcon from '@/components/FoldIcon'

const LayoutWrap = styled.div`
  width: 100%;
  height: 100vh;
`

const HeaderWrap = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #ffe4e4;
`

const Content = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
  overflow: auto;
  display: flex;
`

const Main = styled.div`
  height: 100%;
  width: calc(100% - 56px);
  flex: 1;
  background: #d8fff2;
  position: relative;
`

export const Container = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const { userInfo, loginInfo } = useSelector(store => store.user)
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]
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
        {userInfo?.company_permissions?.length > 0 && (
          <LayoutWrap>
            <HeaderWrap>
              <HeaderLeft />
              <HeaderRight />
            </HeaderWrap>
            <Content>
              <Side />
              <Main>
                <FoldIcon />
                <Outlet />
              </Main>
            </Content>
            <Next
              visible={isNextVisible}
              close={() => setIsNextVisible(false)}
            />
          </LayoutWrap>
        )}
        {userInfo?.company_permissions?.length <= 0 && <NoPermission />}
      </ConfigProvider>
    </KitConfigProvider>
  )
}
