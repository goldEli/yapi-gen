// 登陆页面
import { useState, useEffect, useReducer } from 'react'
import LoginForm from './LoginForm'
import style from './index.module.css'
import { reducer, installState } from './login'
import { getTicket } from './services'
import { getQueryParam } from './utils'
import dayjs from 'dayjs'
import GlobalStyle from '@/components/GlobalStyle'
import styled from '@emotion/styled'

const Page = () => {
  const [languageMode, dispatch]: [any, any] = useReducer(reducer, installState)
  const chooseLanguageMode = (index: number) => {
    dispatch({
      type: index,
    })
  }
  useEffect(() => {
    const arr = ['zh', 'en']
    const lang = getQueryParam('language') || 'zh'
    localStorage.setItem('languageMode', String(arr.findIndex(i => i === lang)))
    chooseLanguageMode(arr.findIndex(i => i === lang))
  }, [])
  const redirect = async () => {
    const ticketResponse = await getTicket()

    // return
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
      const urlVal = '/ProjectManagement/Project'
      location.href = location.href.includes('localhost')
        ? `http://localhost:8000?ticket=${ticket}&language=${arr[lang]}`
        : `${urlVal}?ticket=${ticket}&language=${arr[lang]}`
    }
  }

  useEffect(() => {
    localStorage.clear()
    // check()
  }, [])
  // if (isAuthorized && target && target !== 'oa') {
  //   return (
  //     <div className={style.pageAuth}>
  //       <AuthorizedLogin redirect={redirect} />
  //     </div>
  //   )
  // }

  const LeftWrap = styled.div`
    width: 100%;
    height: 100%;
    background: url('https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/loginBg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0px 40px;
    .dot {
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
    .logo {
      position: absolute;
      left: 0px;
      top: 0px;
      padding: 40px;
    }
    .title {
      color: var(--neutral-n1-d1);
      font-weight: 500;
      font-size: 32px;
      font-family: SiYuanMedium;
      margin-top: 160px;
      line-height: 38px;
    }
    .title2 {
      font-size: 18px;
      color: var(--neutral-n2);
      font-family: SiYuanRegular;
      margin-top: 20px;
      line-height: 23px;
    }
  `

  const GuideBg = styled.img`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 40vh;
    z-index: 2;
  `

  const FooterText = styled.div`
    font-size: 12px;
    font-family: SiYuanRegular;
    color: var(--neutral-n3);
    position: fixed;
    bottom: 44px;
  `

  const FormWrap = styled.div`
    min-width: 488px;
    min-height: 532px;
    background: var(--neutral-white-d7);
    box-shadow: 0px 1px 29px 0px rgba(20, 37, 98, 0.11);
    border-radius: 12px 12px 12px 12px;
    border: 1px solid var(--neutral-n6-d1);
    display: flex;
    align-items: center;
    justify-content: center;
  `

  return (
    <div className={style.page}>
      <GlobalStyle />
      <div className={style.left}>
        <GuideBg
          src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/loginBg_2.png"
          width="80%"
        />
        <LeftWrap>
          <img
            className="dot"
            src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/loginBg_1.png"
            width={217}
          />
          <div className="logo">
            <img
              src="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/sso/logo.png"
              width={207}
            />
          </div>
          <div className="title">{languageMode.title1}</div>
          <div className="title2">{languageMode.title2}</div>
        </LeftWrap>
      </div>

      <div className={style.right}>
        <FormWrap>
          <LoginForm
            redirect={redirect}
            dispatch={dispatch}
            languageMode={languageMode}
          />
        </FormWrap>
        <FooterText>
          © {dayjs().format('YYYY')} IFUN All Rights Reserved.
        </FooterText>
      </div>
    </div>
  )
}

export default Page
