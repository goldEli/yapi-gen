// 整体页面结构

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Outlet, useNavigate } from 'react-router-dom'
import { Side } from './components/Side'
import Next from './components/Next'
import { useModel } from '@/models'
import { changeLanguage, loadedAntdLocals } from '@/locals'
import NoPermission from './components/NoPermission'
import { useTranslation } from 'react-i18next'
import { ConfigProvider, message } from 'antd'

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
  const navigate = useNavigate()
  const [isNextVisible, setIsNextVisible] = useState(false)
  const { loginInfo, userInfo, getUserDetail, login, setLoginInfo } =
    useModel('user')
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
      setLoginInfo(data.data)
    }

    await getUserDetail()
  }

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
    const { company_permissions } = userInfo
    if (!sessionStorage.getItem('saveRouter')) {
      company_permissions?.forEach((element: any) => {
        if (element.group_name.includes('概况')) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate('/Situation')
        } else if (element.group_name.includes('项目')) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate('/Project')
        } else if (element.group_name.includes('我的')) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate('/mine')
        } else if (element.group_name.includes('员工')) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate('/staff')
        } else if (element.group_name.includes('公司管理')) {
          sessionStorage.setItem('saveRouter', '首次登录')
          navigate('/Setting')
        }
      })
    }
  }, [loginInfo, userInfo])

  return (
    <ConfigProvider locale={antdLocal} autoInsertSpaceInButton={false}>
      {userInfo?.company_permissions?.length && (
        <Wrap>
          <Side />
          <Main>
            <Outlet />
          </Main>
          <Next visible={isNextVisible} close={() => setIsNextVisible(false)} />
        </Wrap>
      )}
      {!userInfo?.company_permissions?.length && <NoPermission />}
    </ConfigProvider>
  )
}
