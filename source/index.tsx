// 主页面

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Routes from '@/routes'
import log from '@jihe/secure-log'
import 'antd/dist/antd.css'
import './style.less'
import styled from '@emotion/styled'
import { store } from '../store'
import { Provider } from 'react-redux'
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
import ImageViewer from './components/ImageViewer'

log.init({ isDEV: import.meta.env.DEV })
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.__URL_HASH__}>
    {/* <ErrorBoundary> */}
      <Provider store={store}>
        <WaterMarkContent>
          <ImageViewer />
          <Routes />
        </WaterMarkContent>
      </Provider>
    {/* </ErrorBoundary> */}
  </BrowserRouter>,
)

log.print(__VERSION__)
