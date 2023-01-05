// 整体页面结构

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Side } from './components/Side'
import Next from './components/Next'
import { changeLanguage, loadedAntdLocals } from '@/locals'
import NoPermission from './components/NoPermission'
import { useTranslation } from 'react-i18next'
import { ConfigProvider, message } from 'antd'
import { useDispatch, useSelector } from '../../../store'
import { getStatus } from '../../../store/waterState'
import { getLoginDetail } from '../../../store/user/user.thunk'
import { ConfigProvider as KitConfigProvider } from '@xyfe/uikit'
import { login } from '@/services/user'
import { useModel } from '@/models'
import { getAsyncCompanyInfo } from '@store/companyInfo'

const Wrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex: 1;
  overflow-x: auto;
`

const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  flex: 1;
  min-width: 1440px;
  padding-left: 80px;
`

export const Container = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const { userInfo, loginInfo } = useSelector(
    (store: { user: any }) => store.user,
  )
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
      const data = await login()
    }
    dispatch(getLoginDetail())
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
  const jumpList = [
    {
      name: '概况',
      path: '/Situation',
    },
    {
      name: '项目',
      path: '/Project',
    },
    {
      name: '我的',
      path: '/mine',
    },
    {
      name: '员工',
      path: '/staff',
    },
    {
      name: '消息',
      path: '/Situation',
    },

    {
      name: '公司管理',
      path: '/Setting',
    },
    {
      name: '日志',
      path: '/Situation',
    },
  ]

  useEffect(() => {
    setIsNextVisible(loginInfo.admin_first_login)
    const { company_permissions } = userInfo

    const routerMap = Array.from(
      new Set(company_permissions?.map((i: any) => i.group_name)),
    )
    if (location.pathname === '/') {
      if (routerMap.length >= 1) {
        routerMap.concat('日志')
        if (!sessionStorage.getItem('saveRouter')) {
          for (let i = 0; i <= jumpList.length; i++) {
            if (routerMap?.includes(jumpList[i].name)) {
              sessionStorage.setItem('saveRouter', '首次登录')
              navigate(jumpList[i].path)
              break
            }
          }
        }
      }
    }
  }, [loginInfo, userInfo])

  return (
    <KitConfigProvider local={language as any}>
      <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
        {userInfo?.company_permissions?.length > 0 && (
          <Wrap>
            <Side />
            <Main>
              <Outlet />
            </Main>
            <Next
              visible={isNextVisible}
              close={() => setIsNextVisible(false)}
            />
          </Wrap>
        )}
        {userInfo?.company_permissions?.length <= 0 && <NoPermission />}
      </ConfigProvider>
    </KitConfigProvider>
  )
}
