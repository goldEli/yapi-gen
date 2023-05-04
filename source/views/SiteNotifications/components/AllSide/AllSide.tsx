import CommonIconFont from '@/components/CommonIconFont'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuItem } from '../SiteNotificationSide/style'

const AllSide = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<any>()

  const items = [
    {
      id: '1',
      title: t('all_notices'),
      icon: 'bell',
    },
    {
      id: '2',
      title: t('unread_notifications'),
      icon: 'bell-notification',
    },
    {
      id: '3',
      title: t('read_notifications'),
      icon: 'bell-off',
    },
    {
      id: '4',
      title: t('referring_to_my'),
      icon: 'mention',
    },
  ]

  return (
    <div
      style={{
        paddingTop: '24px',
        height: 'calc(100% - 24px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {items.map((i: any) => (
        <MenuItem
          key={i.id}
          idx={i.id === id}
          onClick={() => navigate(`/SiteNotifications/AllNote/${i.id}`)}
        >
          <CommonIconFont type={i.icon} color="var(--neutral-n3)" size={18} />
          <div>{i.title}</div>
        </MenuItem>
      ))}
      <MenuItem
        style={{
          marginTop: 'auto',
        }}
        idx={false}
        onClick={() => navigate('/SiteNotifications/Setting/1')}
      >
        <CommonIconFont type="settings" color="var(--neutral-n3)" size={18} />
        <div>{t('notification_settings') as string}</div>
      </MenuItem>
    </div>
  )
}

export default AllSide
