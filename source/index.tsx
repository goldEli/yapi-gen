// 主页面

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from '@/models'
import Routes from '@/routes'
import log from '@jihe/secure-log'
import 'antd/dist/antd.css'
import './style.less'
import styled from '@emotion/styled'
import { store } from '../store'
import { Provider as RtkProvider } from 'react-redux'
import WaterMarkContent from './components/WaterMarkContent'
import { ErrorBoundary } from './components/ErrorBoundary'

export const Loading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

import '@/locals'
import GlobalStyle from './components/GlobalStyle'

log.init({ isDEV: import.meta.env.DEV })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.__URL_ALIAS__}>
    <ErrorBoundary>
      <GlobalStyle />
      <RtkProvider store={store}>
        <Provider>
          <WaterMarkContent>
            <Routes />
          </WaterMarkContent>
        </Provider>
      </RtkProvider>
    </ErrorBoundary>
  </BrowserRouter>,
)

log.print(__VERSION__)
