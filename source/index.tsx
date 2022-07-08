import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from '@/models'
import Routes from '@/routes'
import log from '@jihe/secure-log'
import 'antd/dist/antd.css';

log.init({ isDEV: import.meta.env.DEV })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <Routes />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)

log.print(VERSION)
