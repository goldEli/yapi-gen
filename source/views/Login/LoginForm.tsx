/* eslint-disable */
// @ts-nocheck

// 登陆表单
import style from './Login.module.css'
import Filed from './components/Filed'
import { useNavigate } from 'react-router-dom'
import SecretImage from './components/SecretImage'
import { useState, useEffect, useReducer } from 'react'
import {
  language,
  TForm,
  InputMode,
  reducer,
  installState,
  systemData,
} from './login'
import React from 'react'
import {
  getCaptcha,
  toLogin,
  checkToken,
  getTicket,
  checkSecret,
} from './services'
import { getQueryParam } from './utils'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

export default React.memo((props: { redirect(): void }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState<TForm>({
    username: '',
    password: '',
    code: '',
    captchaId: '',
    captchaType: 2,
    id: 0,
  })
  const [show, setShow] = useState<string>('password')
  const [captchaImage, setCaptchaImag] = useState('')
  const [popupsState, setPopupsState] = useState(false)
  const [mode] = useState('2')
  const [secretVisible, setSecretVisible] = useState(false)
  const [secretImage, setSecretImage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorState, setErrorState] = useState(false)
  const [languageMode, dispatch]: [any, any] = useReducer(reducer, installState)
  const [focusNumber, setFocusNumber] = useState(0)
  const target = getQueryParam('target')
  const [agree, setAgree] = useState(true)

  useEffect(() => {
    const arr = ['zh', 'en']
    const lang = getQueryParam('language') || 'zh'
    localStorage.setItem('languageMode', String(arr.findIndex(i => i === lang)))
    chooseLanguageMode(arr.findIndex(i => i === lang))
  }, [])
  useEffect(() => {
    window.addEventListener('keydown', onkeydown)
    return () => {
      window.removeEventListener('keydown', onkeydown)
    }
  }, [form])
  useEffect(() => {
    window.addEventListener('click', () => {
      setPopupsState(false)
    })
    return () => {
      window.removeEventListener('click', () => {
        setPopupsState(false)
      })
    }
  }, [popupsState])
  useEffect(() => {
    check()
    if (mode == '1') {
      getCaptchaCode()
    }
  }, [mode])
  useEffect(() => {
    if (focusNumber === 1) {
      setErrorMessage(languageMode.userWarning)
    } else if (focusNumber === 2) {
      setErrorMessage(languageMode.passwordWarning)
    } else if (focusNumber === 3) {
      setErrorMessage(languageMode.codeWarning)
    }
    // else if(focusNumber === 4) {
    //   setErrorMessage(languageMode.userError)
    // } else if(focusNumber === 5) {
    //   setErrorMessage(languageMode.passwordError)
    // }else if(focusNumber === 6) {
    //   setErrorMessage(languageMode.codeError)
    // }
  }, [languageMode])

  // const onCheckValue = (val: number) => {
  //   if(val === 1 && form.username) {
  //     if (!/^[0-9]*$/gu.test(form.username)) {
  //       setFocusNumber(4)
  //       setErrorMessage(languageMode.userError)
  //       return
  //     }
  //   } else if (val === 2 && form.password) {
  //     if (!/^([a-zA-Z\d])+$/gu.test(form.password) || ![/[a-z]+/gu, /[A-Z]+/gu, /\d+/gu].every(i => i.test(form.password))) {
  //       setFocusNumber(5)
  //       setErrorMessage(languageMode.passwordError)
  //       // console.log(111)
  //       return
  //     }
  //   } else if(val === 3 && form.code){
  //     if (!/^[0-9]*$/gu.test(form.code)) {
  //       setFocusNumber(6)
  //       setErrorMessage(languageMode.codeError)
  //       return
  //     }
  //   }
  // }

  const login = async () => {
    if (!(form.username && form.password && form.code)) {
      if (form.username == '') {
        setFocusNumber(1)
        setErrorMessage(languageMode.userWarning)
      } else if (form.password == '') {
        setFocusNumber(2)
        setErrorMessage(languageMode.passwordWarning)
      } else if (form.code == '') {
        setFocusNumber(3)
        setErrorMessage(languageMode.codeWarning)
      }
      return
    }

    // if (!/^[0-9]*$/gu.test(form.username)) {
    //   setFocusNumber(4)
    //   setErrorMessage(languageMode.userError)
    //   return
    // }

    // if (!/^([a-zA-Z\d])+$/gu.test(form.password) || ![/[a-z]+/gu, /[A-Z]+/gu, /\d+/gu].every(i => i.test(form.password))) {
    //   setFocusNumber(5)
    //   setErrorMessage(languageMode.passwordError)
    //   return
    // }

    // if (!/^[0-9]*$/gu.test(form.code)) {
    //   setFocusNumber(6)
    //   setErrorMessage(languageMode.codeError)
    //   return
    // }

    const data = {
      account: form.username,
      captchaCode: form.code,
      captchaId: form.captchaId,
      captchaType: form.captchaType,
      id: 0,
      pwd: form.password,
    }
    const res = await toLogin(data)
    if (res.code === 0) {
      localStorage.token = res.data.token
      // props.redirect()
      navigate(`/ProjectManagement/Project`)
    } else {
      setErrorMessage(res.msg)
      setErrorState(true)
    }
  }

  const check = async () => {
    try {
      const response = await checkToken()
      if (response.code == 0) {
        props.redirect()
      }
    } catch (error) {
      localStorage.removeItem('token')
    }
  }

  const getCaptchaCode = () => {
    getCaptcha().then(data => {
      setForm({ ...form, captchaId: data.data.captchaId })
      setCaptchaImag(data.data.info)
    })
  }

  const onChangeShow = () => {
    show === 'text' ? setShow('password') : setShow('text')
  }

  const chooseLanguageMode = (index: number) => {
    dispatch({
      type: index,
    })
  }

  const controlPopups = (e: any) => {
    e.nativeEvent.stopImmediatePropagation()
    setPopupsState(!popupsState)
  }

  const onkeydown = (e: any) => {
    if (e.keyCode === 13) {
      login()
    }
  }

  const handleInputChange = (event: { target: any }) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const onCheckSecret = async () => {
    if (
      form.username &&
      form.password &&
      form.username.length >= 1 &&
      form.password.length >= 1
    ) {
      const response = await checkSecret({
        account: form.username,
        pwd: form.password,
      })
      if (response.success && response.data.secret) {
        setSecretImage(response.data.secret)
        setSecretVisible(true)
      }
    }
  }

  const changeFocus = () => {
    setFocusNumber(0)
    setErrorMessage('')
    setErrorState(false)
  }

  const onChange = (e: any) => {
    setAgree(e.target.checked)
  }
  const isDisable = !agree || !form.code || !form.username || !form.password

  const Lang = styled.span`
    display: inline-block;
    font-size: 14px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: var(--neutral-n2);
    line-height: 22px;
    margin: 0 4px;
  `

  return (
    <div className={`${style.main} ${secretVisible ? style.filter : ''}`}>
      {(!target || target === 'oa' || !systemData[target]) && (
        <div className={style.title}>
          <p>{languageMode[systemData.agile.loginFormTitle]}</p>
        </div>
      )}
      {target && systemData[target] ? (
        <div className={style.headLogo}>
          <div className={style.logoWrap}>
            <img className={style.logo_img} src="/sso/logo.svg" alt="" />
            <img className={style.switch_img} src="/sso/switch.svg" alt="" />
            <img
              className={style.logo_img}
              src={systemData[target]?.logo}
              alt=""
            />
          </div>
          <p className={style.title_text}>
            {languageMode.useOALogin} <span>{systemData[target]?.name}</span>
          </p>
        </div>
      ) : null}
      <div className={style.form}>
        <Filed
          mode={InputMode.NORMAL}
          name="username"
          icon="/user.svg"
          value={form.username}
          label={languageMode.user}
          type="text"
          onChangeEvent={handleInputChange}
          onCheckSecret={onCheckSecret}
          isHighlight={focusNumber === 1 || focusNumber === 4}
          isErrorHighlight={
            (focusNumber === 1 || focusNumber === 4) && errorState
          }
          onChangeFocus={changeFocus}
          // onCheckValue={() => onCheckValue(1)}
        />
        <Filed
          name="password"
          mode={InputMode.LOCK}
          icon="/lock.svg"
          value={form.password}
          label={languageMode.password}
          type={show}
          onChangeEvent={handleInputChange}
          onChangeShow={onChangeShow}
          onCheckSecret={onCheckSecret}
          isHighlight={focusNumber === 2 || focusNumber === 5}
          isErrorHighlight={
            (focusNumber === 2 || focusNumber === 5) && errorState
          }
          onChangeFocus={changeFocus}
          bigChar={languageMode.bigChar}
          // onCheckValue={() => onCheckValue(2)}
        />
        {mode === '1' ? (
          <Filed
            name="code"
            img={captchaImage}
            icon="/pen.svg"
            mode={InputMode.CODE}
            value={form.code}
            label={languageMode.code}
            type="text"
            onChangeEvent={handleInputChange}
            onChangeCaptchaImag={getCaptchaCode}
            isHighlight={focusNumber === 3 || focusNumber === 6}
            isErrorHighlight={
              (focusNumber === 3 || focusNumber === 6) && errorState
            }
            onChangeFocus={changeFocus}
            // onCheckValue={() => onCheckValue(3)}
          />
        ) : (
          <Filed
            name="code"
            mode={InputMode.NORMAL}
            icon="/pen.svg"
            value={form.code}
            label={languageMode.code}
            type="text"
            onChangeEvent={handleInputChange}
            isHighlight={focusNumber === 3 || focusNumber === 6}
            isErrorHighlight={
              (focusNumber === 3 || focusNumber === 6) && errorState
            }
            onChangeFocus={changeFocus}
            // onCheckValue={() => onCheckValue(3)}
          />
        )}
        <div
          style={{ visibility: errorMessage.length > 0 ? 'visible' : 'hidden' }}
          className={`${style.toast} ${
            !errorState ? style.toast_warning : style.toast_error
          }`}
        >
          {/* <img
            className={style.toast_icon}
            src={!errorState ? "/warning.svg" : "error.svg"}
            alt=""
          /> */}
          <span>{errorMessage}</span>
        </div>
      </div>
      <button
        {...(isDisable ? {} : { onClick: login })}
        className={`${style.button} ${isDisable ? style.disable_button : ''}`}
      >
        {languageMode.login}
      </button>
      <div className={style.agree} hidden={!target}>
        <div className={style.checkboxWrap}>
          <div
            className={`${style.checkbodStyle} ${agree ? style.checked : ''}`}
          />
          <input
            checked={agree}
            name="agree"
            type="checkbox"
            className={style.input}
            onChange={onChange}
          />
        </div>

        <div>
          <p>
            {languageMode.authorizedLogin}
            {/* {languageMode.readed}
            <a> {languageMode.agreement}</a> {languageMode.and}
            <a> {languageMode.privacy}</a> {languageMode.getPermission} */}
          </p>
          <ul className={style.agree_ul}>
            <li> {languageMode.publicInformation}</li>
            <li> {languageMode.book}</li>
          </ul>
        </div>
      </div>

      {/* <div className={style.language}>
        <div className={style.lang}>
          {
            language[languageMode.id].name
          }
          {language.map((value, index) => (
            <>
              {index === 0 ? null : "  |  "}
              <div
                onClick={() => chooseLanguageMode(index)}
                className={`${style.popups_item} ${
                  languageMode.id == index ? style.popups_item_active : ""
                }`}
                key={index}
              >
                {value.name}
              </div>
            </>
          ))}
        </div>
      </div> */}
      <div className={style.headWrap}>
        <div>
          <img src="/sso/logo.png" width={207} />
        </div>
        <div onClick={controlPopups} className={style.language}>
          <div className={style.langBox}>
            <img src="/sso/LineIcon.svg" alt="" className={style.LineIcon} />
            <Lang className={style.lang}>{language[languageMode.id].name}</Lang>
            <IconFont
              style={{
                fontSize: 16,
                color: 'var(--neutral-n2)',
                cursor: 'pointer',
              }}
              type={popupsState ? 'up-icon' : 'down-icon'}
            />
          </div>
          {popupsState ? (
            <div className={style.popups}>
              {language.map((value, index) => (
                <div
                  onClick={() => chooseLanguageMode(index)}
                  className={`${style.popups_item} ${
                    languageMode.id == index ? style.popups_item_active : ''
                  }`}
                  key={index}
                >
                  {value.name}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <SecretImage
        operationNotes={languageMode.operationNotes}
        operationManual={languageMode.operationManual}
        secretVisible={secretVisible}
        secretImage={secretImage}
        close={() => {
          setSecretVisible(false)
        }}
      ></SecretImage>
    </div>
  )
})
