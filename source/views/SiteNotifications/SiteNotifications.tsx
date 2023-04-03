import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { changeVisible } from '@store/SiteNotifications'
import { Badge } from 'antd'
import React from 'react'

const SiteNotifications = () => {
  const dispatch = useDispatch()
  const isVisible = useSelector(store => store.siteNotifications.isVisible)
  return (
    <Badge size="small" offset={[-2, 1]} count={5}>
      <CommonIconFont
        onClick={() => dispatch(changeVisible(!isVisible))}
        color="var(--neutral-n2)"
        size={24}
        type="bell"
      />
    </Badge>
  )
}

export default SiteNotifications
