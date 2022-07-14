import React from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'
import { Side } from './components/Side'
const Wrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

const Main = styled.div`
  background: rgba(245, 247, 250, 1);
  flex: 1;
  /* overflow: scroll; */
`

export const Container = () => {
  return (
    <Wrap>
      <Side></Side>
      <Main>
        <Outlet />
      </Main>
    </Wrap>
  )
}
