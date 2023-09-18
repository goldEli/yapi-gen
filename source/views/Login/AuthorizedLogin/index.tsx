// 外部登录授权
/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect, useReducer } from 'react'
import style from './index.module.css'
import Button from '../components/Button'
import { reducer, installState } from '../login'
import UserAvatar from '../components/UserAvatar'

export default React.memo((props: { redirect(): void }) => {
  const [languageMode, dispatch] = useReducer(reducer, installState)
  const userAdmin = JSON.parse(localStorage.getItem('userAdmin') || '{}')

  const onLogin = () => {
    props.redirect()
  }
  return (
    <div className={style.authContent}>
      <h4>iFUN OA {languageMode.oaAuth}</h4>
      <div className={style.authAvatar}>
        <UserAvatar avatar={userAdmin?.avatar} name={userAdmin?.name} />
        <div className={style.authName}>{userAdmin?.name}</div>
      </div>
      <Button onClick={onLogin}>{languageMode.oaAuth}</Button>
      <div className={style.authTip}>
        <div>{languageMode.auth}</div>
        <ul className={style.agree_ul}>
          <li> {languageMode.publicInformation}</li>
          <li> {languageMode.book}</li>
        </ul>
      </div>
    </div>
  )
})
