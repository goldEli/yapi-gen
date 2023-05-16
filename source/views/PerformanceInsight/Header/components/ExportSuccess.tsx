import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import {
  ModalStyle,
  ModalHeader,
  Title,
  ModalContent,
  ModalFooter,
} from '../Style'
interface Props {
  isVisible: boolean
  title?: string
  text?: string
  onChangeVisible?: any
  onConfirm(): void
  children?: any
  // 没有取消按钮
  notCancel?: boolean
  onCancel?: any
  onCancelState?: boolean
}
const ExportSuccess = (props: Props) => {
  const [t] = useTranslation()
  return (
    <ModalStyle
      visible={props.isVisible}
      title={false}
      footer={false}
      bodyStyle={{ padding: '20px 0px 0px 0px' }}
      closable={false}
      width={420}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
    >
      <ModalHeader>
        <Title>
          <IconFont
            style={{ fontSize: 24, color: 'var(--function-success)' }}
            type="check-91i0o6ja"
          />
          <div
            style={{
              width: '260px',
              display: 'inline-block',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {props.title ? props.title : t('confirmationOfDeletion')}
          </div>
        </Title>
        {!props?.notCancel && (
          <CloseWrap
            width={32}
            height={32}
            onClick={() =>
              props?.onCancelState ? props.onCancel() : props.onChangeVisible()
            }
          >
            <IconFont style={{ fontSize: 20 }} type="close" />
          </CloseWrap>
        )}
      </ModalHeader>
      <ModalContent>{props.children ?? props.text}</ModalContent>
      <ModalFooter size={16}>
        {!props?.notCancel && (
          <CommonButton onClick={props.onChangeVisible} type="light">
            {t('cancel')}
          </CommonButton>
        )}
        <CommonButton type="primary" onClick={props.onConfirm}>
          {t('confirm')}
        </CommonButton>
      </ModalFooter>
    </ModalStyle>
  )
}
export default ExportSuccess
