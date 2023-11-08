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
          <div>设置预警推送可将任务、BUG的逾期或即将逾期</div>
          <div>情况按条件定时推送至系统通知、钉钉群、邮件、短信</div>
        </div>
        <CommonButton type="light" onClick={onClose}>
          前往设置
        </CommonButton>
      </Box>
    </Wrap>
  )
}
export default NoSettingPage
