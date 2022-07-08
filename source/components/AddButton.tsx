import React from 'react'
import styled from '@emotion/styled'
import IconFont from './IconFont'

const AddButton = styled.div({
  height: 32,
  padding: '0 8px',
  borderRadius: 4,
  background: '#ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white'
})

interface Props {
  text: string
  onChangeClick?(): void
}

export default (props: Props) => (
  <AddButton onClick={props.onChangeClick}>
    <IconFont style={{ marginRight: 8, fontSize: 16 }} type="lineadd" />
    <span>{props.text}</span>
  </AddButton>
)
