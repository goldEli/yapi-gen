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
import { useSelector, useDispatch } from '@store/index'
import CommonIconFont from '@/components/CommonIconFont'
import { saveWarningConfig } from '@/services/project'
import useProjectId from '../hooks/useProjectId'
import { setProjectWarning } from '@store/project'
interface WaringCardProps {
  onChangeSetting(): void
}
interface mapInterface {
  [key: string | number]: string
}
const WaringCard = (props: WaringCardProps) => {
  const [t] = useTranslation()
  const { language } = useSelector(store => store.global)
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  const { projectId } = useProjectId()
  const {
    push_date,
    push_condition = [],
    push_channel = [],
    push_obj,
    is_open,
  } = projectWarning
  const { day = [], time = {} } = push_date ?? {}

  const weekMaps: mapInterface = {
    0: t('onMonday'),
    1: t('tuesday'),
    2: t('wednesday'),
    3: t('thursday'),
    4: t('friday'),
    5: t('saturday'),
    6: t('sunday'),
  }
  const taskType: mapInterface = {
    task_soon_expired: '任务即将逾期',
    task_expired: '任务逾期',
    bug_soon_expired: 'BUG即将逾期',
    bug_expired: 'BUG逾期',
    bug_too_many: 'BUG数量过多',
  }
  const noticeType: mapInterface = {
    sys: t('systemNotification'),
    ding: t('dingtalkReminder'),
    email: t('emailAlert'),
    sms: t('smsNotification'),
  }
  const pushDateLabel = () => {
    return day?.map((item: any, index: number) => {
      return (
        <span key={index}>
          {weekMaps[item]}
          {language === 'zh' ? <i>、</i> : <i> / </i>}
        </span>
      )
    })
  }
  const noticeTypeLabel = () => {
    return push_channel?.map((item: any, index: number) => {
      return (
        <span key={index}>
          {noticeType[item.type]}
          {index !== push_channel?.length - 1 &&
            (language === 'zh' ? <i>、</i> : <i> / </i>)}
        </span>
      )
    })
  }
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
        <Switch
          checked={is_open === 1}
          onChange={async checked => {
            let res = await saveWarningConfig({
              ...projectWarning,
              project_id: projectId,
              push_obj: push_obj?.map((item: any) => item.id),
              is_open: checked ? 1 : 2,
            })

            dispatch(
              setProjectWarning({
                ...projectWarning,
                is_open: checked ? 1 : 2,
              }),
            )
          }}
        />
      </WaringCardHeader>
      <WaringCardContent>
        <WaringCardItem style={{ width: '45%' }}>
          <div className="label">{t('pushTime')}：</div>
          <div>
            {pushDateLabel()}
            {time.begin}-{time.end}
          </div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%' }}>
          <div className="label">
            {t('methodToInforme')}：<div>{noticeTypeLabel()}</div>
          </div>
          <div className="content"></div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '45%', marginTop: 16 }}>
          <div className="label">{t('pushConditions')}：</div>
          <div className="content">
            {push_condition?.map((item: any) => (
              <span key={item.type}>
                [{taskType[item.type]}] {item.cond_conf}天以上 / 超过
                {item.send_conf}条
              </span>
            ))}
          </div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%', marginTop: 16 }}>
          <div className="label">{t('notifyPersonnel')}：</div>
          <div className="content">{push_obj?.length}位项目成员</div>
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
