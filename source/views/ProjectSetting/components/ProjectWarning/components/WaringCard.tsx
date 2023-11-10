import { useTranslation } from 'react-i18next'
import {
  SwitchLabel,
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
import { getProjectInfo, saveWarningConfig } from '@/services/project'
import useProjectId from '../hooks/useProjectId'
import { setProjectInfo, setProjectWarning } from '@store/project'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useState } from 'react'
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
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [checked, setChecked] = useState(false)
  const {
    push_date,
    push_condition = [],
    push_channel = [],
    push_obj,
    is_open,
  } = projectWarning ?? {}

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
    task_soon_expired: t('taskIsAboutToExpire'),
    task_expired: t('taskIsOverdue'),
    bug_soon_expired: t('bugIsAboutToExpire'),
    bug_expired: t('bugOverdue'),
    bug_too_many: t('tooManyBugs'),
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
    return push_channel
      ?.filter((item: any) => item.is_enable === 1)
      .map((item: any, index: number) => {
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
        {is_open === 1 ? <SwitchLabel>{t('inForce')}</SwitchLabel> : null}
        <Switch
          checked={is_open === 1}
          unCheckedChildren=""
          onChange={async checked => {
            setChecked(checked)
            if (checked === false) {
              setIsDeleteVisible(true)
              return
            }
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
            // 如果是未设置的项目设置过了要更新下projectInfo里面的信息
            const result = await getProjectInfo({ projectId: projectId })
            dispatch(setProjectInfo(result))
          }}
        />
      </WaringCardHeader>
      <WaringCardContent>
        <WaringCardItem style={{ width: '45%' }}>
          <div className="label">{t('pushTime')}：</div>
          <div style={{ color: 'var(--neutral-n1-d1)' }}>
            {pushDateLabel()}
            {time.begin}-{time.end}
          </div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%' }}>
          <div className="label">
            {t('methodToInforme')}：
            <div style={{ color: 'var(--neutral-n1-d1)' }}>
              {noticeTypeLabel()}
            </div>
          </div>
          <div className="content"></div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '45%', marginTop: 16 }}>
          <div className="label">{t('pushConditions')}：</div>
          <div className="content">
            {push_condition
              ?.filter((item: any) => item.is_enable === 1)
              .map((item: any) => (
                <span key={item.type}>
                  [{taskType[item.type]}]
                  {item.type === 'bug_too_many'
                    ? t('moreThanThan1', {
                        day: item.cond_conf,
                        count: item.send_conf,
                      })
                    : t('moreThanThan', {
                        day: item.cond_conf,
                        count: item.send_conf,
                      })}
                  {/* {item.send_conf} */}
                  {t('strip')}
                </span>
              ))}
          </div>
        </WaringCardItem>
        <WaringCardItem style={{ width: '40%', marginTop: 16 }}>
          <div className="label">{t('notifyPersonnel')}：</div>
          <div className="content">
            {push_obj?.length}
            {t('projectMembers')}
          </div>
        </WaringCardItem>
        <WaringGoto onClick={props.onChangeSetting}>
          <span>{t('goToSettings')}</span>
          <CommonIconFont type="right" size={16} />
        </WaringGoto>
      </WaringCardContent>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title={t('whetherToTurnOffRiskWarning')}
        text={t('afterYourProjectMembersWillNotReceiveAnyEarlyWarning')}
        okText={t('confirmClose')}
        onChangeVisible={() => {
          setIsDeleteVisible(false)
        }}
        onCancelState
        onConfirm={async () => {
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
          setIsDeleteVisible(false)

          // 如果是未设置的项目设置过了要更新下projectInfo里面的信息
          const result = await getProjectInfo({
            projectId: projectId,
          })
          dispatch(setProjectInfo(result))
        }}
      ></DeleteConfirm>
    </WaringCardWrap>
  )
}

export default WaringCard
