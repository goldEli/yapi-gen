import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from '@/models'
import Routes from '@/routes'
import log from '@jihe/secure-log'
import 'antd/dist/antd.css'
import './style.less'

log.init({ isDEV: import.meta.env.DEV })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.__URL_ALIAS__}>
    <Provider>
      <Routes />
    </Provider>
  </BrowserRouter>,
)

log.print(VERSION)
