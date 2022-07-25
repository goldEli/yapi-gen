import React, { useEffect, useState } from 'react'
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
`

const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  flex: 1;
  overflow: auto;
  min-width: 1360px;
`

export const Container = () => {
  const [nextVisible, setNextVisible] = useState(false)
  const { getLoginDetail } = useModel('user')

  const init = async () => {
    const res = await getLoginDetail()
    setNextVisible(res.data.admin_first_login)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Wrap>
      <Side />
      <Main>
        <Outlet />
      </Main>
      <Next visible={nextVisible} close={() => setNextVisible(false)} />
    </Wrap>
  )
}
