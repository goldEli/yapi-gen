// 登陆页面
import React, { useState, useEffect, useRef, useReducer } from 'react'
import LoginForm from './LoginForm'
import style from './index.module.css'
import { reducer, installState } from './login'
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
import GlobalStyle from '@/components/GlobalStyle'
import styled from '@emotion/styled'
import { Carousel } from 'antd'

const Page = () => {
  const [isAuthorized, setIsAuthorized] = useState(true)
  const target = getQueryParam('target')
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
        ? `http://192.168.2.64:8000?ticket=${ticket}&language=${arr[lang]}`
        : `${urlVal}?ticket=${ticket}&language=${arr[lang]}`
    }
  }

  const check = async () => {
    try {
      const response = await checkToken()
      if (response.code === 0) {
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
    console.log('clear')

    localStorage.clear()
    // check()
  }, [])
  if (isAuthorized && target && target !== 'oa') {
    return (
      <div className={style.pageAuth}>
        <AuthorizedLogin redirect={redirect} />
      </div>
    )
  }

  const LeftWrap = styled.div`
    width: 100%;
    height: 100%;
    background: var(--primary-d1);
    border-radius: 12px 12px 12px 12px;
    position: relative;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `

  const CarouselWrap = styled(Carousel)`
    width: 90% !important;
    max-width: 700px !important;
    min-width: 400px !important;
    position: absolute !important;
    z-index: 99;
    right: 0px;
    .slick-dots {
      margin-left: 40%;
      width: 68px;
      height: 24px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 24px 24px 24px 24px;
      color: var(--neutral-white-d7);
      display: flex !important;
      align-items: center;
      justify-content: space-evenly !important;
      li {
        width: 0px !important;
        height: 0px !important;
        top: -2px;
        left: -3px;
      }

      li.slick-active button {
        border: 1px solid var(--neutral-white-d7);
        opacity: 1;
        width: 8px;
        height: 8px;
        background: var(--neutral-white-d7);
        top: -1px;
      }
      li button {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        opacity: 0.4;
        background: var(--neutral-white-d7);
      }
    }
  `

  const CarouselItem = styled.div`
    padding-top: 72px;
  `

  const ItemTitle = styled.div`
    font-size: 18px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: #ffffff;
    line-height: 26px;
    margin-bottom: 8px;
  `
  const ItemIntroduce = styled.div`
    height: 44px;
    font-size: 14px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    margin-bottom: 50px;
    padding-right: 72px;
  `
  const ItemImage = styled.img`
    width: 100%;
    margin-bottom: 32px;
  `
  const TopBgImage = styled.img`
    position: absolute;
    top: 0px;
    right: 0px;
  `
  const BottomBgImage = styled.img`
    position: absolute;
    left: 0px;
    bottom: 0px;
  `
  const FooterText = styled.div`
    font-size: 12px;
    font-family: SiYuanRegular;
    color: var(--neutral-n3);
  `

  return (
    <div className={style.page}>
      <GlobalStyle />
      <div className={style.left}>
        <LeftWrap>
          <TopBgImage src="/topBg.png" />
          <BottomBgImage src="/bottomBg.png" />
          <CarouselWrap effect="fade" autoplay>
            <CarouselItem>
              <ItemTitle>{languageMode.CarouselTitle1}</ItemTitle>
              <ItemIntroduce>{languageMode.CarouselDesc1}</ItemIntroduce>
              <ItemImage src="/loginBg1.png" />
            </CarouselItem>
            <CarouselItem>
              <ItemTitle>{languageMode.CarouselTitle2}</ItemTitle>
              <ItemIntroduce>{languageMode.CarouselDesc2}</ItemIntroduce>
              <ItemImage src="/loginBg2.png" />
            </CarouselItem>
            <CarouselItem>
              <ItemTitle>{languageMode.CarouselTitle3}</ItemTitle>
              <ItemIntroduce>{languageMode.CarouselDesc3}</ItemIntroduce>
              <ItemImage src="/loginBg3.png" />
            </CarouselItem>
          </CarouselWrap>
        </LeftWrap>
      </div>
      <div className={style.right}>
        <LoginForm
          redirect={redirect}
          dispatch={dispatch}
          languageMode={languageMode}
        />
        <FooterText>
          © {dayjs().format('YYYY')} IFUN All Rights Reserved.
        </FooterText>
      </div>
    </div>
  )
}

export default Page
