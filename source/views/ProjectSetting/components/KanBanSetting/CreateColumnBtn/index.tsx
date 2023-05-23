import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Input, InputRef } from 'antd'
import { createColumn } from '@store/kanbanConfig'
import { useDispatch } from '@store/index'

interface CreateColumnBtnProps {}

const IconWrap = styled(IconFont)`
  color: var(--neutral-n2);
  font-size: 20px;
`
const CreateColumnBtnBox = styled.div<{ showBg: boolean }>`
  width: 302px;
  flex-shrink: 0;
  height: 100%;
  background-color: ${props => (props.showBg ? 'var(--neutral-n9)' : 'none')};
  box-sizing: border-box;
`
const BtnBox = styled.div<{ show: boolean }>`
  width: 52px;
  height: 48px;
  background: var(--neutral-n9);
  display: ${props => (props.show ? 'flex' : 'none')};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  &:hover ${IconWrap} {
    color: var(--primary-d2);
  }
`

const EditArea = styled.div<{ show: boolean }>`
  display: ${props => (props.show ? 'flex' : 'none')};
  gap: 16px;
  align-items: center;
  padding: 8px 16px;
  box-sizing: border-box;
  width: 100%;
`

const TextBtn = styled.div<{ active?: boolean }>`
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: ${props =>
    props.active
      ? 'var(--auxiliary-text-t2-d2)'
      : 'var(--auxiliary-text-t2-d1)'};
  cursor: pointer;
`

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
