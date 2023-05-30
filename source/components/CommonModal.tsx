// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
import { Modal, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap, ModalFooter } from './StyleCommon'
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

const ModalStyle = styled(Modal)`
  max-width: 100vw;
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    padding: 0px;
  }
`

interface CommonModalProps {
  draft?: boolean
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
  isHeader?: boolean
  onSaveDraft?(): void
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
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      mask={props.isShowMask}
      zIndex={props.dex}
    >
      {!props.isHeader && (
        <ModalHeader>
          <span>{props?.title}</span>
          <Space size={4}>
            {props.hasTop}
            <CloseWrap onClick={props?.onClose} width={32} height={32}>
              <IconFont
                style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                type="close"
              />
            </CloseWrap>
          </Space>
        </ModalHeader>
      )}

      <div style={{ minHeight: 154 }}>{props?.children}</div>
      {!props?.isShowFooter && (
        <>
          {props?.hasFooter}
          {!props.hasFooter && (
            <ModalFooter size={16}>
              {props.draft ? (
                <div
                  style={{
                    position: 'absolute',
                    left: '24px',
                    bottom: '24px',
                  }}
                >
                  <CommonButton
                    type="secondaryText"
                    onClick={props.onSaveDraft}
                  >
                    存草稿
                  </CommonButton>
                </div>
              ) : null}

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
        </>
      )}
    </ModalStyle>
  )
}

export default CommonModal
