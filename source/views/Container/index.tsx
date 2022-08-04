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

export const Container = () => {
  const navigate = useNavigate()
  const [isNextVisible, setIsNextVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { loginInfo, userInfo, getLoginDetail, getUserDetail, login }
    = useModel('user')

  const init = async () => {
    if (!localStorage.getItem('token')) {
      await login()
    }

    await getLoginDetail()
    await getUserDetail()
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    setIsNextVisible(loginInfo.admin_first_login)

    const { company_permissions } = userInfo
    localStorage.setItem('saveRouter', '1')
    // eslint-disable-next-line complexity
    if (!localStorage.getItem('saveRouter')) {
      company_permissions?.forEach((element: any) => {
        if (element.group_name.includes('概况')) {
          navigate('/Situation')
          return
        }
        if (element.group_name.includes('项目')) {
          navigate('/Project')
          return
        }
        if (element.group_name.includes('我的')) {
          navigate('/mine')
          return
        }
        if (element.group_name.includes('员工')) {
          navigate('/staff')
          return
        }
        if (element.group_name.includes('公司管理')) {
          navigate('/Setting')
        }
      })
    }
  }, [loginInfo, userInfo])
  return (
    <Wrap>
      <Side />
      <Main>
        <Outlet />
      </Main>
      <Next visible={isNextVisible} close={() => setIsNextVisible(false)} />
    </Wrap>
  )
}
