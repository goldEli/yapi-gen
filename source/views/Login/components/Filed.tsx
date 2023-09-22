/* eslint-disable */
// @ts-nocheck
// 字段
import styled from '@emotion/styled'
import { useRef, useState, useReducer, useEffect } from 'react'
import style from './Filed.module.css'
import { Dropdown } from 'antd'

import CountryCode from '@/components/CountryCode'
export default (props: any) => {
  const [isFocus, setIsFocus] = useState(false)
  const [bigChar, setBigChar] = useState(false)
  const [border, setBorder] = useState(false)
  const [getMsg, setGetMsg] = useState(1)
  const [time, setTime] = useState(60)
  const [conutryCode, setConutryCode] = useState('+86')
  const myForm = useRef<any>()

  const onKeyChange = (e: any) => {
    let inputText = e.target.value
    let stolen = inputText.length
    if (stolen) {
      let uniCode = inputText.charCodeAt(stolen - 1)
      if (uniCode >= 65 && uniCode <= 90) {
        setBigChar(true)
      } else {
        setBigChar(false)
      }
    }
  }

  const getClass = () => {
    if (props.isErrorHighlight) {
      return `${style.error_active} ${style.field}`
    } else if (props.isHighlight) {
      return `${style.warning_active} ${style.field}`
    } else if (border) {
      return `${style.active} ${style.field}`
    } else {
      return `${style.field}`
    }
  }

  const onGetMsg = (num?: number) => {
    setGetMsg(num)
    setTime(60)
    if (num === 2) {
      console.log('调接口')
    }
  }

  useEffect(() => {
    if (time === 0) {
      setGetMsg(1)
      return
    }
    const intervalId = setInterval(() => {
      setTime(time - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [time])

  const onCountryCodeChange = (val: string) => {
    const [phoneCode, countryCode] = val.split('/')
    setConutryCode(phoneCode)
  }
  return (
    <div ref={myForm} className={getClass()}>
      {props.mode === 4 ? (
        <div>
          <CountryCode
            icon="down-icon"
            value={conutryCode}
            onChange={onCountryCodeChange}
          />
        </div>
      ) : (
        <img
          style={{
            width: '20px',
            height: '20px',
          }}
          src={props.icon}
          alt=""
        />
      )}

      <input
        ref={props.inputRef}
        onKeyUp={onKeyChange}
        onBlur={() => {
          setBorder(false)
          setIsFocus(false)
          props.onCheckSecret ? props.onCheckSecret() : ''
          // props.onCheckValue()
        }}
        onFocus={() => {
          setBorder(true)
          setIsFocus(true)
        }}
        name={props.name}
        value={props.value}
        type={props.type}
        className={style.input}
        placeholder={props.label}
        onChange={evt => {
          props.onChangeEvent(evt)
          props.onChangeFocus(false)
        }}
      />

      {props.mode === 1 ? (
        <img
          onClick={() => {
            props.onChangeShow()
          }}
          style={{
            width: '20px',
            height: '20px',
          }}
          src={
            props.type == 'text'
              ? 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/login/open.svg'
              : 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/login/close.svg'
          }
          alt=""
        />
      ) : props.mode === 2 ? (
        <img
          style={{
            width: '100px',
            height: '40px',
          }}
          src={props.img}
          onClick={props.onChangeCaptchaImag}
          alt=""
        />
      ) : props.mode === 3 ? (
        <div>
          {getMsg === 1 ? (
            <span
              onClick={() => onGetMsg(2)}
              style={{ color: '#6688FF', fontSize: 14 }}
            >
              获取验证码
            </span>
          ) : getMsg === 2 ? (
            <span style={{ color: '#BBBDBF', fontSize: 14 }}>
              已发送({time})s
            </span>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      {isFocus && props.mode === 1 && (
        <span className={style.hint}>{bigChar && <i>{props.bigChar}</i>}</span>
      )}
      {props.name === 'username' && props?.errorCheck?.username ? (
        <span className={style.hint}>{props?.errorCheck?.username}</span>
      ) : null}
    </div>
  )
}
