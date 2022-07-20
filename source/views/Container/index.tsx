import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { Side } from './components/Side'
import Next from './components/Next'
const Wrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex: 1 0 auto;
`

const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  // flex: 1;
  flex: 1 0 auto;
  width: 0;
  height: 100%;
  overflow: hidden;
  // overflow: scroll;
`

export const Container = () => {
  const [nextVisible, setNextVisible] = useState(true)
  return (
    <Wrap>
      <Side></Side>
      <Main>
        <Outlet />
      </Main>
      {/* <Next visible={nextVisible} close={() => setNextVisible(false)} /> */}
    </Wrap>
  )
}
