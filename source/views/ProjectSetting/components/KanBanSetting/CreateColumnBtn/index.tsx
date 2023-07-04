import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Input, InputRef } from 'antd'
import { createColumn } from '@store/kanbanConfig'
import { useDispatch } from '@store/index'
import {
  BtnBox,
  CreateColumnBtnBox,
  EditArea,
  IconWrap,
  TextBtn,
} from './styled'
import useI18n from '@/hooks/useI18n'
import useKanBanData from '../hooks/useKanBanData'
import { getMessage } from '@/components/Message'

interface CreateColumnBtnProps {}

const CreateColumnBtn: React.FC<CreateColumnBtnProps> = props => {
  const [isEdit, setIsEdit] = useState(false)
  const inputTagRef = useRef<InputRef>(null)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const { t } = useI18n()
  const { columnList } = useKanBanData()
  useEffect(() => {
    if (inputTagRef.current) {
      inputTagRef.current?.focus?.()
    }
  }, [inputTagRef.current])

  const onCancel = () => {
    setInputValue('')
    setIsEdit(false)
  }

  return (
    <CreateColumnBtnBox showBg={isEdit}>
      <BtnBox
        show={!isEdit}
        onClick={() => {
          setIsEdit(true)
        }}
      >
        <IconWrap type="plus" />
      </BtnBox>
      <EditArea show={isEdit}>
        <Input
          onChange={e => {
            setInputValue(e.target.value)
          }}
          value={inputValue}
          ref={inputTagRef}
          placeholder={t('enter_the_name_of_the_column')}
          style={{ width: 182 }}
        />
        <TextBtn
          onClick={e => {
            if (!inputValue) {
              return
            }
            if (columnList.find(item => item.name === inputValue)) {
              getMessage({ msg: '列名称已存在', type: 'error' })
              return
            }
            e.stopPropagation()
            onCancel()
            dispatch(createColumn(inputValue))
          }}
          active
        >
          {t('create')}
        </TextBtn>
        <TextBtn
          onClick={e => {
            e.stopPropagation()
            onCancel()
          }}
        >
          {t('cancel')}
        </TextBtn>
      </EditArea>
    </CreateColumnBtnBox>
  )
}

export default CreateColumnBtn
