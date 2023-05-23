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

interface CreateColumnBtnProps {}

const CreateColumnBtn: React.FC<CreateColumnBtnProps> = props => {
  const [isEdit, setIsEdit] = useState(false)
  const inputTagRef = useRef<InputRef>(null)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')

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
          placeholder="输入列的名称"
          style={{ width: 182 }}
        />
        <TextBtn
          onClick={e => {
            if (!inputValue) {
              return
            }
            e.stopPropagation()
            onCancel()
            dispatch(createColumn(inputValue))
          }}
          active
        >
          创建
        </TextBtn>
        <TextBtn
          onClick={e => {
            e.stopPropagation()
            onCancel()
          }}
        >
          取消
        </TextBtn>
      </EditArea>
    </CreateColumnBtnBox>
  )
}

export default CreateColumnBtn
