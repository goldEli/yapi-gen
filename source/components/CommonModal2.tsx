// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
import { Modal, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import CommonButton from './CommonButton'

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  height: 56px;

  padding: 0 13px 0 24px;
  font-family: SiYuanMedium;
`
const ModalFooter = styled.div({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  gap: '16px',
  padding: '0 20px 0 24px',
})

const ModalStyle = styled(Modal)`
  max-width: 100vw;
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
`
const CloseWrap = styled.div<{ width?: any; height?: any }>`
  z-index: 999;
  position: absolute;
  top: 96px;
  right: 40px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`
interface CommonModalProps {
  // 是否显示
  isVisible: boolean
  // 弹窗宽度
  width?: number | string
  // 标题
  title?: string
  hasTop?: any
  // 关闭事件
  onClose?(): void
  children: React.ReactNode
  // 是否展示底部操作
  isShowFooter?: boolean
  // 自定义底部
  hasFooter?: React.ReactNode
  // 确认事件
  onConfirm?(): void
  // 确认按钮文字
  confirmText?: string
  bodyStyle?: any
  // 是否显示遮罩层
  isShowMask?: boolean
  noCancel?: boolean
  dex?: number
  noFooter?: boolean
}

const CommonModal = (props: CommonModalProps) => {
  const [t] = useTranslation()
  return (
    <ModalStyle
      footer={false}
      open={props?.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ ...props.bodyStyle }}
      width={props?.width || 528}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      mask={props.isShowMask}
      zIndex={props.dex}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        <ModalHeader>
          {props.hasTop}
          <CloseWrap onClick={props?.onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </ModalHeader>
        <div style={{ height: 'calc(100vh - 56px)' }}>{props?.children}</div>
        {!props.noFooter && (
          <ModalFooter>
            {props?.noCancel ? null : (
              <CommonButton type="light" onClick={props?.onClose}>
                {t('common.cancel')}
              </CommonButton>
            )}

            <CommonButton type="primary" onClick={props?.onConfirm}>
              {props?.confirmText ? props?.confirmText : t('common.confirm')}
            </CommonButton>
          </ModalFooter>
        )}
      </div>
    </ModalStyle>
  )
}

export default CommonModal
