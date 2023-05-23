import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

interface CreateColumnBtnProps {}

const IconWrap = styled(IconFont)`
  color: var(--neutral-n2);
  font-size: 20px;
`
const CreateColumnBtnBox = styled.div`
  width: 52px;
  height: 48px;
  background: var(--neutral-n9);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  &:hover ${IconWrap} {
    color: var(--primary-d2);
  }
`

const CreateColumnBtn: React.FC<CreateColumnBtnProps> = props => {
  return (
    <CreateColumnBtnBox>
      <IconWrap type="plus" />
    </CreateColumnBtnBox>
  )
}

export default CreateColumnBtn
