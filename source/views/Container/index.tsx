/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { Side } from './components/Side'
import Next from './components/Next'
import { useModel } from '@/models'
// eslint-disable-next-line no-duplicate-imports
import { useNavigate } from 'react-router-dom'
import {
  changeLanguage,
  languages,
  loadedAntdLocals,
  type LocaleKeys,
} from '@/locals'
import NoPermission from './components/NoPermission'
import { useTranslation } from 'react-i18next'
import { ConfigProvider } from 'antd'

const Wrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex: 1;
  overflow: hidden;
`

const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  flex: 1;
  overflow: auto;
  /* min-width: 1360px; */
`
window.onbeforeunload = function () {
  localStorage.removeItem('saveRouter')
}

export const Container = () => {
  const navigate = useNavigate()
  const [isNextVisible, setIsNextVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { loginInfo, userInfo, getLoginDetail, getUserDetail, login }
    = useModel('user')
  const {
    i18n: { language },
  } = useTranslation()
  const antdLocal = loadedAntdLocals[language]

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
      await login()
    }

    await getLoginDetail()
    await getUserDetail()
  }

  useEffect(() => {
    const languageParams
      = (localStorage.getItem('language') as 'zh' | 'en')
      || ((new URLSearchParams(location.search).get('language') || 'zh') as
        | 'zh'
        | 'en')
    localStorage.setItem('language', languageParams)
    changeLanguage(languageParams)
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsNextVisible(loginInfo.admin_first_login)

    const { company_permissions } = userInfo

    // eslint-disable-next-line complexity
    if (!localStorage.getItem('saveRouter')) {
      company_permissions?.forEach((element: any) => {
        if (element.group_name.includes('概况')) {
          localStorage.setItem('saveRouter', '1')
          navigate('/Situation')
        } else if (element.group_name.includes('项目')) {
          localStorage.setItem('saveRouter', '1')
          navigate('/Project')
        } else if (element.group_name.includes('我的')) {
          localStorage.setItem('saveRouter', '1')
          navigate('/mine')
        } else if (element.group_name.includes('员工')) {
          localStorage.setItem('saveRouter', '1')
          navigate('/staff')
        } else if (element.group_name.includes('公司管理')) {
          localStorage.setItem('saveRouter', '1')
          navigate('/Setting')
        }
      })
    }
  }, [loginInfo, userInfo])

  return (
    <ConfigProvider locale={antdLocal}>
      {userInfo?.company_permissions?.length ? (
        <Wrap>
          <Side />
          <Main>
            <Outlet />
          </Main>
          <Next visible={isNextVisible} close={() => setIsNextVisible(false)} />
        </Wrap>
      )
        : <NoPermission />
      }
    </ConfigProvider>
  )
}
