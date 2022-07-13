import React from 'react'
import styled from '@emotion/styled'
import IconFont from './IconFont'

const AddButton = styled.div({
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
})

interface Props {
  text: string
  onChangeClick?(): void
  placeholder?: string
}

export default (props: Props) => (
  <AddButton onClick={props.onChangeClick}>
    <IconFont
      style={{ marginRight: 8, fontSize: 14, fontWeight: 400, color: 'white' }}
      type="plus"
      placeholder={props.placeholder}
    />
    <span>{props.text}</span>
  </AddButton>
)
