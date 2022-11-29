// 添加按钮

import styled from '@emotion/styled'
import IconFont from './IconFont'

const Wrap = styled.div({
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  width: 'fit-content',
})

interface Props {
  text: string
  onChangeClick?(e?: any): void
}

const AddButton = (props: Props) => (
  <Wrap onClick={props.onChangeClick}>
    <IconFont
      style={{ marginRight: 8, fontSize: 14, fontWeight: 400, color: 'white' }}
      type="plus"
    />
    <span>{props.text}</span>
  </Wrap>
)

export default AddButton
