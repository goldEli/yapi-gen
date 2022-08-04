import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from '@/models'
import Routes from '@/routes'
import log from '@jihe/secure-log'
import 'antd/dist/antd.css'
import './style.less'
import { Suspense } from 'react'
import styled from '@emotion/styled'
import { Spin } from 'antd'

export const Loading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

import '@/locals'

log.init({ isDEV: import.meta.env.DEV })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense
    fallback={
      <Loading>
        <Spin size="large" />
      </Loading>
    }
  >
    <BrowserRouter basename={import.meta.env.__URL_ALIAS__}>
      <Provider>
        <Routes />
      </Provider>
    </BrowserRouter>
  </Suspense>,
)

log.print(VERSION)
