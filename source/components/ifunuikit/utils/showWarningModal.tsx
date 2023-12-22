import { Modal } from 'antd'
// 弹出框样式
import { css } from '@emotion/css'
import Icon from '../assets/icons'

const textModal = css`
  .ant-modal-confirm .ant-modal-body {
    padding: 24px;
  }
  .ant-modal-confirm-body .ant-modal-confirm-content {
    margin-top: 12px;
    font-size: 14px;
    color: #646566;
    line-height: 22px;
    margin-left: 33px !important;
  }
  .ant-modal-confirm-body > .anticon {
    margin-right: 8px;
  }
  .ant-modal-confirm-body .ant-modal-confirm-title {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    line-height: 24px;
  }
  .ant-modal-confirm-btns .ant-btn {
    height: 32px;
    background: #f5f7fa;
    border-radius: 6px 6px 6px 6px;
    padding: 5px 16px;
    font-size: 14px;
    font-weight: 400;
    color: #646566;
    line-height: 22px;
    border: none;
  }
  .ant-modal-confirm-btns .ant-btn-primary {
    background-color: #617ef2;
    color: #fff;
    box-shadow: none;
    &:hover {
      color: #fff;
      background-color: #6685ff;
    }
    &:active {
      color: #fff;
      background-color: #496af2;
    }
  }
  .ant-modal-confirm-btns .ant-btn-default {
    background-color: #f7f8fa;
    color: #646566;
    box-shadow: none;
    &:hover {
      color: #617ef2;
      background-color: #f7f8fa;
    }
    &:active {
      color: #617ef2;
      background-color: #edf2ff;
    }
  }
  .ant-modal-content {
    position: relative;
  }
  .ant-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 4px 4px 4px 4px;
    position: absolute;
    top: 24px;
    right: 18px;
    &:hover {
      background: #f7f8fa;
    }
  }
  .ant-modal-close-x {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .anticon {
      font-size: 20px;
      color: #646566;
    }
  }
`

export const showWarningModal = (prop: {
  onOk: any
  title: string
  okText?: string
  content: string
}) => {
  const { onOk, title, okText, content } = prop
  Modal.confirm({
    wrapClassName: textModal,
    title,
    icon: <Icon type="warning" style={{ color: '#FA9746', fontSize: 24 }} />,
    closable: true,
    centered: true,
    maskClosable: false,
    okText,
    content,
    onOk,
    width: 420,
    closeIcon: <Icon type="close" />,
  })
}
