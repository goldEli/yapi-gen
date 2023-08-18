/* eslint-disable new-cap */
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { Breadcrumb, Switch, Space } from 'antd'
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
import { setMyEmailConfiguration } from '@store/SiteNotifications'
import { getMessage } from '@/components/Message'
import { useNavigate } from 'react-router-dom'
import EmailBox from '../components/EmailBox/EmailBox'

const Email = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    setChoose([])
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
      getMessage({ msg: t('succeed'), type: 'success' })
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
            <a
              onClick={() => {
                navigate('/SiteNotifications/AllNote/1')
              }}
              style={{ color: 'var(--neutral-n1-d1)' }}
            >
              {t('notification')}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('email_notification')}</Breadcrumb.Item>
        </Breadcrumb>

        <CommonButton onClick={onSave} type="primary">
          <span>{t('common.save')}</span>
        </CommonButton>
      </First>
      <Content>
        <EmailBox
          style={{ marginBottom: '48px' }}
          t1={t('notificationReceivingMethod')}
          t2={t(
            'setEmailToReceiveTimelyUpdatesOnTheAffairsAndCommentsOfTheParticipatingProjects',
          )}
        >
          <div
            style={{
              padding: '24px 32px',
            }}
          >
            <span
              style={{
                color: 'var(--neutral-n1-d1)',
              }}
            >
              {t('theCurrentEmailAddressIs')}：
            </span>
            {email ? (
              <span
                style={{
                  fontFamily: 'SiYuanMedium',
                  color: 'var(--neutral-n1-d1)',
                }}
              >
                {email}
              </span>
            ) : (
              '--'
            )}
          </div>
        </EmailBox>
        <EmailBox
          t1={t('notificationPushCategory')}
          t2={t('selectTheDynamicCategoryOfTheProjectThatNeedsToBeReceived')}
        >
          <div
            style={{
              padding: '24px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {emailConfigurations?.map((i: any) => (
              <div style={{ width: '180px', marginRight: '72px' }} key={i.id}>
                <Switch
                  size="small"
                  checked={choose.includes(i.id)}
                  onChange={() => onChoose(i.id)}
                />
                <span style={{ marginLeft: '6px' }}>{i.text}</span>
              </div>
            ))}
          </div>
        </EmailBox>
      </Content>
    </Wrap>
  )
}

export default Email
