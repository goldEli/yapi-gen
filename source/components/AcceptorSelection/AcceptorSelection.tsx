/* eslint-disable no-undefined */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import { Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import Addperson from '@/views/WorkReport/Formwork/Addperson'
import { useTranslation } from 'react-i18next'

const AcceptorSelection = (props: any) => {
  const [isEmail, setIsEmail] = useState(false)
  const [t] = useTranslation()

  const [person1, setPerson1] = useState<any>([])

  const onChange2 = (e: any) => {
    setIsEmail(e.target.checked)

    props.onChange({
      member: person1,

      isEmail: e.target.checked,
    })
  }

  const onChangedel = (el: any, num: number) => {
    let data1: any = person1 || []

    if (num === 1) {
      data1 = person1.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    }

    props.onChange({
      member: data1,

      isEmail,
    })
  }

  const onChangeValues = (values: any, num: number) => {
    let d1: any = person1 || []

    if (num === 1) {
      const val1 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d1 = [...val1]
    }

    props.onChange({
      member: d1,

      isEmail,
    })
  }

  useEffect(() => {
    setIsEmail(props?.value?.isEmail)
    setPerson1(props?.value?.member ? props?.value?.member : [])
  }, [props.value])

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '-30px', left: '80px' }}>
        <Checkbox checked={isEmail} onChange={onChange2}>
          <span
            style={{
              height: '20px',
              fontSize: '12px',
              verticalAlign: 'text-bottom',
              color: 'var(--neutral-n2)',
              lineHeight: '20px',
            }}
          >
            {t('simultaneous_email_notification')}
          </span>
        </Checkbox>
      </div>
      <Addperson
        data={props.data}
        onChangedel={val => onChangedel(val, 1)}
        onChangeValues={val => onChangeValues(val, 1)}
        person={person1}
        isShow={false}
        state={1}
      />
    </div>
  )
}

export default AcceptorSelection
