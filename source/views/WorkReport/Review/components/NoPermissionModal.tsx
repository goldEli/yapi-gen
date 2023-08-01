import styled from '@emotion/styled'
import imgSrc from '../image/assistantExampleImage.png'
import CommonModal from '@/components/CommonModal'
import { getMessage } from '@/components/Message'
import { sendNotice } from '@/services/report'
import { useTranslation } from 'react-i18next'

const NoPermissionWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NoPermissionText = styled.div`
  font-size: 14px;
  font-family: SiYuanRegular;
  color: var(--neutral-n3);
  margin: 24px 0px;
`

interface NoPermissionProps {
  id: number
  visible: boolean
  close(): void
}

const NoPermissionModal = (props: NoPermissionProps) => {
  const [t]: any = useTranslation()
  const { close, visible, id } = props
  const confirm = async () => {
    const result = await sendNotice(id)
    if (result) {
      getMessage({
        type: 'success',
        msg: t('report.list.notifiedToAdministrator'),
      })
      close()
    }
  }

  return (
    <CommonModal
      width={640}
      title={t('report.list.reportAssistant')}
      isVisible={visible}
      onClose={close}
      onConfirm={confirm}
      confirmText={t('report.list.openFunc')}
    >
      <NoPermissionWrap>
        <img width={466} src={imgSrc} />
        <NoPermissionText>
          {t('report.list.contactAdministrator')}
        </NoPermissionText>
      </NoPermissionWrap>
    </CommonModal>
  )
}

export default NoPermissionModal
