import { Back } from '@/components/AllSide/ProjectDetailSide'
import { MenuItem } from '@/components/AllSide/ProjectSide/style'
import CommonIconFont from '@/components/CommonIconFont'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { First, Title, Wrap } from './style'

const items = [
  {
    id: '1',
    title: '通知项设置',
    icon: 'bell',
    path: '/SiteNotifications/Setting/',
  },
  {
    id: '2',
    title: '邮件通知',
    icon: 'bell-notification',
    path: '/SiteNotifications/Email/',
  },
]

const SiteNotificationSide = () => {
  const navigate = useNavigate()
  const { id } = useParams<any>()
  const [t] = useTranslation()
  const onGoBack = () => {
    navigate('/SiteNotifications/AllNote/1')
  }

  return (
    <Wrap>
      <First>
        <Title>通知设置</Title>
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
          <div>{i.title}</div>
        </MenuItem>
      ))}
    </Wrap>
  )
}

export default SiteNotificationSide