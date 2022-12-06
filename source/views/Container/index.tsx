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
import { useDispatch } from '../../../store'
import { getStatus } from '../../../store/waterState'

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
  const dispatch = useDispatch()
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
    dispatch(getStatus())
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

    if (routerMap.length >= 1) {
      routerMap.concat('日志')
      if (!localStorage.getItem('saveRouter')) {
        for (let i = 0; i <= jumpList.length; i++) {
          if (routerMap?.includes(jumpList[i].name)) {
            localStorage.setItem('saveRouter', '首次登录')
            navigate(jumpList[i].path)
            break
          }
        }
      }
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
