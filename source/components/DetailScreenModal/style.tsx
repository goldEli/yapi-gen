import styled from '@emotion/styled'
import { Modal } from 'antd'

export const Content = styled.div`
  height: 100%;
`

export const ModelClose = styled.div`
  position: absolute;
  right: -54px;
  top: -21px;
  cursor: pointer;
`

export const ModalWrap = styled(Modal)<{
  all?: boolean
}>`
  max-width: ${props => (props.all ? '80vw' : '100vw')};
  margin-left: ${props => (props.all ? 'auto' : '80px')};
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
`

export const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})
