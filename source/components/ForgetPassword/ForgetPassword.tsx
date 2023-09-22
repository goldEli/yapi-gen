import Filed from '@/views/Login/components/Filed'
import { InputMode } from '@/views/Login/login'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ForgetPassword = () => {
  const [errorCheck, setErrorCheck] = useState({})
  const [errorState, setErrorState] = useState(false)
  const inputRef = useRef<any>(null)
  const [t] = useTranslation()
  const [show, setShow] = useState<string>('password')
  const [errorMessage, setErrorMessage] = useState('')
  const [focusNumber, setFocusNumber] = useState(0)
  const [form2, setForm2] = useState<any>({
    phone: '',
    msg: '',
    code: '',
    captchaId: '',
    captchaType: 2,
    id: 0,
  })

  const handleInputChange = (event: { target: any }) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    if (name === 'username') {
      setErrorState(false)
      setErrorCheck({
        username: '',
      })
    }

    setForm2({
      ...form2,
      [name]: value,
    })
  }

  const onCheckSecret = async () => {}
  const onChangeShow = () => {
    show === 'text' ? setShow('password') : setShow('text')
  }
  const changeFocus = () => {
    setFocusNumber(0)
    setErrorMessage('')
    setErrorState(false)
  }

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus()
    }, 200)
  }, [])
  return (
    <div>
      <div>
        <span>修改密码</span>
        <span>返回登录</span>
      </div>
      <div>
        <Filed
          inputRef={inputRef}
          mode={4}
          name="phone"
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/user.svg"
          value={form2.phone}
          label={t('pleaseEnterPhoneNumber')}
          type="text"
          onChangeEvent={handleInputChange}
          onCheckSecret={onCheckSecret}
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
          onChangeEvent={handleInputChange}
          isHighlight={focusNumber === 3 || focusNumber === 6}
          isErrorHighlight={
            (focusNumber === 3 || focusNumber === 6) && errorState
          }
          onChangeFocus={changeFocus}
          // onCheckValue={() => onCheckValue(3)}
        />
        <Filed
          name="password"
          mode={InputMode.LOCK}
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/pen.svg"
          value={form2.password}
          label={t('pleaseEnterANewPassword')}
          type={show}
          onChangeEvent={handleInputChange}
          onChangeShow={onChangeShow}
          onCheckSecret={onCheckSecret}
          isHighlight={focusNumber === 2 || focusNumber === 5}
          isErrorHighlight={
            (focusNumber === 2 || focusNumber === 5) && errorState
          }
          onChangeFocus={changeFocus}
          bigChar={t('theUppercaseKeyboardIsTurnedOn')}
          // onCheckValue={() => onCheckValue(2)}
        />
        <Filed
          name="password"
          mode={InputMode.LOCK}
          icon="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/login/pen.svg"
          value={form2.password}
          label={t('pleaseEnterNewPasswordAgain')}
          type={show}
          onChangeEvent={handleInputChange}
          onChangeShow={onChangeShow}
          onCheckSecret={onCheckSecret}
          isHighlight={focusNumber === 2 || focusNumber === 5}
          isErrorHighlight={
            (focusNumber === 2 || focusNumber === 5) && errorState
          }
          onChangeFocus={changeFocus}
          bigChar={t('theUppercaseKeyboardIsTurnedOn')}
          // onCheckValue={() => onCheckValue(2)}
        />
      </div>
    </div>
  )
}

export default ForgetPassword
