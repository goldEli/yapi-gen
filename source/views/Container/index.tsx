import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { Side } from './components/Side'
import Next from './components/Next'
import { useModel } from '@/models'

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
  const [isNextVisible, setIsNextVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { loginInfo, getLoginDetail, getUserDetail, login } = useModel('user')

  const init = async () => {
    if (!localStorage.getItem('agileToken')) {
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
  }, [loginInfo])
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
