import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { Breadcrumb, Select, Switch, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { First, Wrap } from '../Setting/style'
import {
  ActiveContentEmail2,
  Content,
  Content1,
  ContentEmail,
  ContentEmail2,
} from './style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { editMyAllNoteSet } from '@/services/SiteNotifications'
import {
  setMyConfiguration,
  setMyEmailConfiguration,
} from '@store/SiteNotifications'

const Email = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [choose, setChoose] = useState<any>([])
  const [active, setActive] = useState<any>(true)
  const email = useSelector(store => store.user.loginInfo.email)
  const myConfiguration = useSelector(
    store => store.siteNotifications.myConfiguration,
  )
  const emailConfigurations = useSelector(
    store => store.siteNotifications.emailConfiguration,
  )
  const myEmailConfiguration = useSelector(
    store => store.siteNotifications.myEmailConfiguration,
  )
  const onChange = (checked: boolean) => {
    setActive(checked)
  }

  const onChoose = (id: any) => {
    if (choose.includes(id)) {
      setChoose(choose.filter((i: any) => i !== id))
    } else {
      setChoose([...choose, id])
    }
  }
  const onSave = async () => {
    const res = await editMyAllNoteSet(
      Array.from(new Set([...myConfiguration, ...choose])),
    )

    if (res.code === 0) {
      message.success(t('succeed'))
    }
    dispatch(setMyEmailConfiguration(choose))
  }

  useEffect(() => {
    setChoose(myEmailConfiguration)
  }, [myEmailConfiguration])

  return (
    <Wrap>
      <First>
        <Breadcrumb
          separator={
            <CommonIconFont
              type="right"
              size={14}
              color="var(--neutral-n1-d1)"
            />
          }
        >
          <Breadcrumb.Item>
            <span style={{ color: 'var(--neutral-n1-d1)' }}>
              {' '}
              {t('notification')}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('email_notification')}</Breadcrumb.Item>
        </Breadcrumb>
        {active ? (
          <CommonButton onClick={onSave} type="primary">
            <span>{t('common.save')}</span>
          </CommonButton>
        ) : null}
      </First>
      <Content>
        <Content1>
          {t(
            'ReceiveEmailUpdatesWithMentionsInvitationsAndCommentsAboutItemsYouCareAbout',
          )}
          <span style={{ marginLeft: '250px' }}>
            <Switch checked={active} onChange={onChange} />
          </span>
        </Content1>
        {active ? (
          <ActiveContentEmail2 active={active}>
            <Content1>
              {t('use_this_email_to_receive')}
              <ContentEmail>{email}</ContentEmail>
            </Content1>
            <Content1>{t('receive_format')}</Content1>
            <div>
              <Select
                defaultValue="lucy"
                style={{ width: 320 }}
                options={[
                  {
                    value: 'jack',
                    label: 'HTML',
                  },
                  {
                    value: 'lucy',
                    label: '文本',
                  },
                ]}
              />
            </div>
            <Content1>
              {t('what_situations_require_email_notification')}
            </Content1>
            <div>
              {emailConfigurations.map((i: any) => (
                <ContentEmail2
                  active={choose.includes(i.id)}
                  onClick={() => onChoose(i.id)}
                  key={i.id}
                >
                  {i.text}
                </ContentEmail2>
              ))}
            </div>
          </ActiveContentEmail2>
        ) : null}
      </Content>
    </Wrap>
  )
}

export default Email
