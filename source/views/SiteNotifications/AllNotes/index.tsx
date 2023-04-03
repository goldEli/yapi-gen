import CommonButton from '@/components/CommonButton'
import LeftTitle from '@/components/LeftTitle'
import React from 'react'
import ContentItem from '../components/ContentItem/ContentItem'

const Index = () => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 24px',
          alignItems: 'center',
        }}
      >
        <LeftTitle title="全部通知" />
        <div style={{ display: 'flex', gap: '16px' }}>
          <CommonButton type="light">筛选通知</CommonButton>
          <CommonButton type="light">全部已读</CommonButton>
        </div>
      </div>

      <div style={{ padding: '0 80px' }}>
        <ContentItem />
      </div>
    </div>
  )
}

export default Index
