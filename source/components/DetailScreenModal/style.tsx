import styled from '@emotion/styled'
import { Modal } from 'antd'

export const ModalWrap = styled(Modal)<{ all?: boolean }>`
  max-width: ${props => (props.all ? '80vw' : '100vw')};
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
`

export const Content = styled.div`
  height: 100%;
`
