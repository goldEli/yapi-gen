import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  div: {
    color: 'var(--neutral-n3)',
    fontSize: 14,
  },
})

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 480px;
  .tips {
    padding: 24px 72px;
    text-align: center;
    box-sizing: border-box;
    font-size: 14px;
    color: var(--neutral-n3);
  }
`
type NoSettingPageProps = {
  onClose?(): void
}

const NoSettingPage = (props: NoSettingPageProps) => {
  const [t] = useTranslation()
  const { onClose } = props
  return (
    <Wrap>
      <Box>
        <img
          src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/noData.png"
          style={{ width: 240 }}
          alt=""
        />
        <div className="tips">
          <div>
            {t(
              'setUpEarlyWarningPushToNotifyTheOverdueOrUpcomingOverdueTasksAnd',
            )}
          </div>
          <div>
            {t(
              'theSituationIsRegularlyPushedToSystemDingtalkAndTextMessagesBasedOn',
            )}
          </div>
        </div>
        <CommonButton type="light" onClick={onClose}>
          {t('goToSettings')}
        </CommonButton>
      </Box>
    </Wrap>
  )
}
export default NoSettingPage
