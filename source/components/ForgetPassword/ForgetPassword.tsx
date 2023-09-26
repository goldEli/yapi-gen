/* eslint-disable prefer-regex-literals */
/* eslint-disable semi */
/* eslint-disable no-useless-escape */
/* eslint-disable require-unicode-regexp */
import Filed from '@/views/Login/components/Filed'
import { InputMode } from '@/views/Login/login'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import style from '../../views/Login/Login.module.css'
import { EMAIL_REGEXP, PHONE_NUMBER_REGEXP } from '@/constants'
import styled from '@emotion/styled'
import { editPassword, getMobil } from '@/views/Login/services'
import { css } from '@emotion/css'
import { message } from 'antd'
const bv = css`
  :hover {
    text-decoration: underline;
  }
`

const BianSeDiv1 = styled.div<{ bg: number; tt: number }>`
  width: 108px;
  height: 8px;
  background: ${props =>
    props.bg >= 1 ? 'rgba(250,151,70,0.26)' : ' rgba(150,151,153,0.2)'};
  border-radius: ${props =>
    props.tt === 1
      ? '4px 0 0 4px'
      : props.tt === 2
      ? ' 0 '
      : props.tt === 3
      ? ' 0 4px 4px 0'
      : '0px'};
`
const BianSeDiv2 = styled.div<{ bg: number; tt: number }>`
  width: 108px;
  height: 8px;
  background: ${props =>
    props.bg >= 2 ? ' rgba(67,186,154,0.26)' : ' rgba(150,151,153,0.2)'};
  border-radius: ${props =>
    props.tt === 1
      ? '4px 0 0 4px'
      : props.tt === 2
      ? ' 0 '
      : props.tt === 3
      ? ' 0 4px 4px 0'
      : '0px'};
`
const BianSeDiv3 = styled.div<{ bg: number; tt: number }>`
  width: 108px;
  height: 8px;
  background: ${props =>
    props.bg === 3 ? 'rgba(67,186,154,0.5)' : ' rgba(150,151,153,0.2)'};
  border-radius: ${props =>
    props.tt === 1
      ? '4px 0 0 4px'
      : props.tt === 2
      ? ' 0 '
      : props.tt === 3
      ? ' 0 4px 4px 0'
      : '0px'};
`
interface FProps {
  onClose(): void
}
const ForgetPassword = (props: FProps) => {
  const [errorCheck, setErrorCheck] = useState({})
  const [errorState, setErrorState] = useState(false)
  const inputRef = useRef<any>(null)
  const [t] = useTranslation()
  const [agree, setAgree] = useState(true)
  const [show, setShow] = useState<string>('password')
  const [errorMessage, setErrorMessage] = useState('')
  const [focusNumber, setFocusNumber] = useState(0)
  const [form2, setForm2] = useState<any>({
    phone: '',
    msg: '',
    password: '',
    password2: '',
    code: '',
    captchaId: '',
    captchaType: 2,
    id: 0,
  })

  const handleInputChange = (event: { target: any }) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    if (name === 'phone' || form2.passwodr === form2.passwodr2) {
      setErrorState(false)
      setErrorCheck({
        phone: '',
      })
    }

    setForm2({
      ...form2,
      [name]: value,
    })
  }

  const onCheckSecret2 = async () => {
    if (
      form2.phone &&
      !EMAIL_REGEXP.test(form2.phone) &&
      !PHONE_NUMBER_REGEXP.test(form2.phone)
    ) {
      console.log('f')

      setFocusNumber(1)
      setErrorState(true)
      setErrorCheck({
        phone: t('pleaseEnterAValidPhoneNumber'),
      })
    }
  }
  const onCheckSecret3 = async () => {
    if (form2.password && form2.password2) {
      if (form2.password !== form2.password2 || bP !== 3) {
        console.log(errorCheck)
        setFocusNumber(2)
        setErrorState(true)
        setErrorCheck({
          password2: t('inconsistentOrWeakPasswords'),
        })
      }
    }
  }
  const onChangeShow = () => {
    show === 'text' ? setShow('password') : setShow('text')
  }
  const changeFocus = () => {
    setFocusNumber(0)
    setErrorMessage('')
    setErrorState(false)
  }
  const login = async () => {
    console.log('登录')

    if (
      form2.phone &&
      !EMAIL_REGEXP.test(form2.phone) &&
      !PHONE_NUMBER_REGEXP.test(form2.phone)
    ) {
      return
    }
    if (!(form2.phone && form2.msg && form2.password)) {
      if (form2.phone === '') {
        setFocusNumber(1)
        setErrorMessage('错误')
      } else if (form2.msg === '') {
        setFocusNumber(2)
        setErrorMessage('错误')
      } else if (form2.password === '') {
        setFocusNumber(3)
        setErrorMessage('错误')
      }
      return
    }

    const data = {
      mobile: form2.phone,
      smsCode: form2.msg,
      password: form2.password,
    }

    const res = await editPassword(data)
    console.log(res)

    if (res.code === 0) {
      console.log('成功')
      message.success(t('passwordResetComplete'))
      props.onClose()
      // navigate(`/ProjectManagement/Project`)
    } else {
      setErrorMessage(res.msg)
      setErrorState(true)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus()
    }, 200)
  }, [])
  const bP = useMemo(() => {
    console.log(form2.password)

    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+])[A-Za-z\d~!@#$%^&*()_+]{8,16}$/
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    const weakRegex = /^\d+$/

    if (form2.password && strongRegex.test(form2.password)) {
      console.log(1)

      return 3
    } else if (form2.password && mediumRegex.test(form2.password)) {
      return 2
    } else if (form2.password && weakRegex.test(form2.password)) {
      return 1
    }
    return ''
  }, [form2])
  const isDisable2 =
    !agree ||
    !form2.password ||
    !form2.phone ||
    !form2.msg ||
    !form2.password2 ||
    !form2.password ||
    bP !== 3 ||
    form2.password2 !== form2.password
  // const isDisable2 = false
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '48px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'SiYuanMedium',
            color: '#323233',
            fontSize: '24px',
          }}
        >
          {t('changePassword')}
        </span>
        <span
          className={bv}
          onClick={() => props.onClose()}
          style={{ color: '#6688FF', cursor: 'pointer', fontSize: '16px' }}
        >
          ← {t('backLogin')}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <Filed
          inputRef={inputRef}
          mode={4}
          name="phone"
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/user.svg"
          value={form2.phone}
          label={t('pleaseEnterPhoneNumber')}
          type="text"
          onChangeEvent={handleInputChange}
          onCheckSecret={onCheckSecret2}
          isHighlight={focusNumber === 1 || focusNumber === 4}
          isErrorHighlight={
            (focusNumber === 1 || focusNumber === 4) && errorState
          }
          onChangeFocus={changeFocus}
          errorCheck={errorCheck}
          // onCheckValue={() => onCheckValue(1)}
        />

        <Filed
          name="msg"
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/pen.svg"
          mode={3}
          value={form2.msg}
          label={t('pleaseEnterVerificationCode')}
          type="text"
          past={!!(form2.phone && PHONE_NUMBER_REGEXP.test(form2.phone))}
          onGetMsg={() => {
            if (form2.phone) {
              getMobil(form2.phone)
              message.success(t('verificationCodeSentSuccessfully'))
            }
          }}
          onChangeEvent={handleInputChange}
          isHighlight={focusNumber === 3 || focusNumber === 6}
          isErrorHighlight={
            (focusNumber === 3 || focusNumber === 6) && errorState
          }
          onChangeFocus={changeFocus}
          // onCheckValue={() => onCheckValue(3)}
        />
        <Filed
          errorCheck={errorCheck}
          name="password"
          mode={InputMode.LOCK}
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/password.svg"
          value={form2.password}
          label={t('pleaseEnterANewPassword')}
          type={show}
          onChangeEvent={handleInputChange}
          onChangeShow={onChangeShow}
          onCheckSecret={onCheckSecret3}
          isHighlight={focusNumber === 2 || focusNumber === 5}
          isErrorHighlight={
            (focusNumber === 2 || focusNumber === 5) && errorState
          }
          onChangeFocus={changeFocus}
          bigChar={t('theUppercaseKeyboardIsTurnedOn')}
          // onCheckValue={() => onCheckValue(2)}
        />
        <div
          style={{
            fontSize: '12px',
            color: '#d7d9db',
            marginBottom: '14px',
            marginTop: '-21px',
          }}
        >
          {t(
            'thePasswordMustContainAtLeastOneUppercaseOneLowercaseOneOneSpecialAndMustBeAtLeastAndAtMostIn',
          )}
        </div>
        {bP && (
          <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
            <BianSeDiv1 bg={bP} tt={1} />
            <BianSeDiv2 bg={bP} tt={2} />
            <BianSeDiv3 bg={bP} tt={3} />
          </div>
        )}

        <Filed
          errorCheck={errorCheck}
          name="password2"
          mode={InputMode.LOCK}
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/password.svg"
          value={form2.password2}
          label={t('pleaseEnterNewPasswordAgain')}
          type={show}
          onChangeEvent={handleInputChange}
          onChangeShow={onChangeShow}
          onCheckSecret={onCheckSecret3}
          isHighlight={focusNumber === 2 || focusNumber === 5}
          isErrorHighlight={
            (focusNumber === 2 || focusNumber === 5) && errorState
          }
          onChangeFocus={changeFocus}
          bigChar={t('theUppercaseKeyboardIsTurnedOn')}
          // onCheckValue={() => onCheckValue(2)}
        />

        <div
          style={{
            visibility: errorMessage.length > 0 ? 'visible' : 'hidden',
            top: '326px',
          }}
          className={`${style.toast} ${
            // eslint-disable-next-line no-negated-condition
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
        <button
          {...(isDisable2 ? {} : { onClick: login })}
          className={`${style.button} ${
            isDisable2 ? style.disable_button : ''
          }`}
        >
          {t('confirm')}
        </button>
      </div>
    </div>
  )
}

export default ForgetPassword
