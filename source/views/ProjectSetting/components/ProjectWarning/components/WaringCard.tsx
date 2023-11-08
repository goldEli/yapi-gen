import { useTranslation } from 'react-i18next'
import {
  WaringCardContent,
  WaringCardHeader,
  WaringCardHeaderLeft,
  WaringCardItem,
  WaringCardWrap,
  WaringGoto,
} from '../style'
import { Switch } from 'antd'
import { useSelector } from '@store/index'
import CommonIconFont from '@/components/CommonIconFont'

interface WaringCardProps {
  onChangeSetting(): void
}

const WaringCard = (props: WaringCardProps) => {
  const [t] = useTranslation()
  const { language } = useSelector(store => store.global)

  return (
    <WaringCardWrap>
      <WaringCardHeader>
        <WaringCardHeaderLeft
          style={{
            flexDirection: language === 'zh' ? 'row' : 'column',
            alignItems: language === 'zh' ? 'center' : 'flex-start',
          }}
        >
          <div className="title">{t('riskWarningPushSettings')}</div>
          <div
            className="sub"
            style={{
              maxWidth: language === 'zh' ? '70%' : 'inherit',
              marginLeft: language === 'zh' ? '12px' : '0',
            }}
          >
            {t(
              'theOverdueOrImminentOverdueStatusOfTasksAndBugsCanBePushedToSystemDingtalkAndTextMessagesAtRegularIntervalsBasedOn',
            )}
          </div>
        </WaringCardHeaderLeft>
        <Switch />
      </WaringCardHeader>
      <WaringCardContent>
        <WaringCardItem style={{ width: '45%' }}>
          <div className="label">推送时间：</div>
          <div className="content">周一、周二、周三、周四、周五、9点-12点</div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%' }}>
          <div className="label">通知方式：</div>
          <div className="content">系统通知、钉钉提醒、邮件提醒、短信提醒</div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '45%', marginTop: 16 }}>
          <div className="label">推送条件：</div>
          <div className="content">
            <span>[任务即将逾期] 1天以上 / 超过1条</span>
            <span>[任务即将逾期] 1天以上 / 超过1条</span>
            <span>[任务即将逾期] 1天以上 / 超过1条</span>
            <span>[任务即将逾期] 1天以上 / 超过1条</span>
            <span>[任务即将逾期] 1天以上 / 超过1条</span>
          </div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%', marginTop: 16 }}>
          <div className="label">通知人员：</div>
          <div className="content">21位项目成员</div>
        </WaringCardItem>
        <WaringGoto onClick={props.onChangeSetting}>
          <span>前往设置</span>
          <CommonIconFont type="right" size={16} />
        </WaringGoto>
      </WaringCardContent>
    </WaringCardWrap>
  )
}

export default WaringCard
