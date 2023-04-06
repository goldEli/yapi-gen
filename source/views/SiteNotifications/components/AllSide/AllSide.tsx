import { MenuItem } from '@/components/AllSide/ProjectSide/style'
import CommonIconFont from '@/components/CommonIconFont'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const items = [
  {
    id: '1',
    title: '全部通知',
    icon: 'bell',
  },
  {
    id: '2',
    title: '未读通知',
    icon: 'bell-notification',
  },
  {
    id: '3',
    title: '已读通知',
    icon: 'bell-off',
  },
  {
    id: '4',
    title: '提及我的',
    icon: 'mention',
  },
]

const AllSide = () => {
  const navigate = useNavigate()
  const { id } = useParams<any>()
  console.log(id)

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
        <div>通知设置</div>
      </MenuItem>
    </div>
  )
}

export default AllSide
