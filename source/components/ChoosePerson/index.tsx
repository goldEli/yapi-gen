/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

import styled from '@emotion/styled'
import { Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonUserAvatar from '../CommonUserAvatar'
import NoData from '../NoData'

const PersonItemWrap = styled.div({
  height: 44,
  lineHeight: '44px',
  fontSize: 14,
  color: 'var(--neutral-n1-d1)',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0 16px',
  '&: hover': {
    background: 'var(--neutral-n6-d1)',
  },
})

const PersonWrap = styled.div({
  maxHeight: 200,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  marginTop: 8,
  '::-webkit-scrollbar': { display: 'none' },
})

interface ChoosePersonProps {
  onChangeValue(obj: any): void
  options: any
  visible?: any
}

const ChoosePerson = (props: ChoosePersonProps) => {
  const [t] = useTranslation()
  const [value, setValue] = useState('')
  const inputRefDom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props.visible])

  return (
    <div style={{ padding: '16px 0', width: 240 }}>
      <div style={{ padding: '0 16px' }}>
        <Input
          value={value}
          style={{ height: 32, width: 208 }}
          placeholder={t('newlyAdd.pleaseKeyWord')}
          onChange={e => setValue(e.target.value)}
          allowClear
          autoFocus
          ref={inputRefDom as any}
        />
      </div>
      <PersonWrap>
        {props?.options
          ?.filter((k: any) => k.name.includes(value))
          ?.map((i: any) => {
            return (
              <PersonItemWrap
                key={i.id}
                onClick={() => {
                  props?.onChangeValue(i)
                  setValue('')
                }}
              >
                {i.avatar ? (
                  <img
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 16,
                      marginRight: 8,
                    }}
                    src={i?.avatar}
                    alt=""
                  />
                ) : (
                  <span
                    style={{
                      marginRight: 8,
                    }}
                  >
                    <CommonUserAvatar size="small" />
                  </span>
                )}
                {i.name}
              </PersonItemWrap>
            )
          })}

        {props?.options?.filter((k: any) => k.name.includes(value))?.length <=
          0 && <NoData size="mini" />}
      </PersonWrap>
    </div>
  )
}

export default ChoosePerson
