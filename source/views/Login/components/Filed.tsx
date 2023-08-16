/* eslint-disable */
// @ts-nocheck
// 字段
import styled from '@emotion/styled'
import { useRef, useState, useReducer } from 'react'
import style from './Filed.module.css'

export default (props: any) => {
  const [isFocus, setIsFocus] = useState(false)
  const [bigChar, setBigChar] = useState(false)
  const [border, setBorder] = useState(false)
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

  return (
    <div ref={myForm} className={getClass()}>
      <img
        style={{
          width: '20px',
          height: '20px',
        }}
        src={props.icon}
        alt=""
      />

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
