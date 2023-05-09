// 登陆页面
import React, { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import style from './index.module.css'
import { systemData } from './login'
import AuthorizedLogin from './AuthorizedLogin'
import {
  getCaptcha,
  toLogin,
  checkToken,
  getTicket,
  checkSecret,
} from './services'
import { getQueryParam } from './utils'
import dayjs from 'dayjs'

const Page = () => {
  const [isAuthorized, setIsAuthorized] = useState(true)
  const target = getQueryParam('target')
  const redirect = async () => {
    const ticketResponse = await getTicket()
    const { ticket } = ticketResponse.data
    const url = getQueryParam('redirect')
    const type = getQueryParam('type')
    const arr = ['zh', 'en']
    const lang = Number(localStorage.getItem('languageMode')) || 0
    if (url) {
      if (type === '1') {
        window.name = ticket
        location.href = `${url}?language=${arr[lang]}`
      } else {
        const newUrl = new URL(url)
        newUrl.searchParams.set('ticket', ticket)
        newUrl.searchParams.set('language', arr[lang])
        location.href = newUrl.href
      }
    } else {
      const urlVal = import.meta.env.__OA_URL__
      location.href = location.href.includes('localhost')
        ? `http://192.168.2.9:8080?ticket=${ticket}&language=${arr[lang]}`
        : `${urlVal}?ticket=${ticket}&language=${arr[lang]}`
    }
  }

  const check = async () => {
    try {
      const response = await checkToken()
      if (response.code == 0) {
        setIsAuthorized(true)
        const userData = response.data?.info
        localStorage.setItem('userAdmin', JSON.stringify(userData || {}))
      } else {
        setIsAuthorized(false)
      }
    } catch (error) {
      setIsAuthorized(false)
      localStorage.removeItem('token')
    }
  }

  useEffect(() => {
    check()
  }, [])
  if (isAuthorized && target && target !== 'oa') {
    return (
      <div className={style.pageAuth}>
        <AuthorizedLogin redirect={redirect} />
      </div>
    )
  }
  return (
    <div className={style.page}>
      <div className={style.left}>
        <div className={style.leftWrap}>
          <div className={style.title}>
            <img className={style.title_img} src={systemData.oa.logo} alt="" />
            <img
              className={style.title_text_img}
              src={systemData.oa.logoNamePic}
              alt=""
            />
          </div>
          <div className={style.content}>
            <img className={style.content_img} src="/sso/pic.svg" alt="" />
          </div>
        </div>
      </div>
      <div className={style.right}>
        <LoginForm redirect={redirect} />
        <div className="footer">
          © {dayjs().format('YYYY')} IFUN All Rights Reserved.
        </div>
      </div>
    </div>
  )
}

export default Page
