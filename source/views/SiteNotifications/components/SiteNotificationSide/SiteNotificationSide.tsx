import CommonIconFont from '@/components/CommonIconFont'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Back, First, MenuItem, Title, Wrap } from './style'

const SiteNotificationSide = () => {
  const navigate = useNavigate()
  const { id } = useParams<any>()
  const [t] = useTranslation()
  const items = [
    {
      id: '1',
      title: t('notification_item_settings'),
      icon: 'bell',
      path: '/SiteNotifications/Setting/',
    },
    {
      id: '2',
      title: t('email_notification'),
      icon: 'bell-notification',
      path: '/SiteNotifications/Email/',
    },
  ]

  const onGoBack = () => {
    navigate('/SiteNotifications/AllNote/1')
  }

  return (
    <Wrap>
      <First>
        <Title>{t('notification_settings')}</Title>
        <Back style={{ margin: '14px 0 0 0' }} onClick={onGoBack}>
          <CommonIconFont type="left-md" />
          <span style={{ marginLeft: '2px' }}>{t('back')}</span>
        </Back>
      </First>
      {items.map((i: any) => (
        <MenuItem
          key={i.id}
          idx={i.id === id}
          onClick={() => navigate(`${i.path}${i.id}`)}
        >
          {/* <CommonIconFont type={i.icon} color="var(--neutral-n3)" size={18} /> */}
          {i.title}
        </MenuItem>
      ))}
    </Wrap>
  )
}

export default SiteNotificationSide
