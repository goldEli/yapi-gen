import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import React from 'react'

const Box = styled.div`
  max-width: 400px;
  min-width: 283px;
  padding: 12px;
  background: linear-gradient(47deg, #6688ff 0%, #8ca6ff 100%);
  color: var(--neutral-white-d7);
  border-radius: 6px;
`

const PeopleCard = (props: any) => {
  const {
    name,
    position,
    company,
    avatar,
    email,
    phone,
    departments,
    undone_num,
    completed_rate,
  } = props
  console.log(props)

  return (
    <Box>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px' }}>
            {name}（{position}）
          </div>
          <div style={{ fontSize: '12px' }}>{company}</div>
        </div>
        <img
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          src={avatar}
          alt=""
        />
      </div>
      <div style={{ display: 'flex', marginTop: '12px' }}>
        <div style={{ flex: '50%' }}>
          <div style={{ fontSize: '12px' }}>{completed_rate}%</div>
          <div style={{ fontSize: '12px' }}>任务完成率</div>
        </div>
        <div style={{ flex: '50%' }}>
          <div style={{ fontSize: '12px' }}>{undone_num}</div>
          <div style={{ fontSize: '12px' }}>待完成任务</div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid var(--neutral-white-d7)',
          marginTop: '12px',
          paddingTop: '12px',
        }}
      >
        <div
          style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}
        >
          <IconFont
            style={{
              fontSize: '16px',
              marginRight: '6px',
              alignSelf: 'self-start',
            }}
            type="tree-list-2"
          />
          <div>{departments}</div>
        </div>
        <div
          style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}
        >
          <IconFont
            style={{ fontSize: '16px', marginRight: '6px' }}
            type="envelope"
          />
          {email}
        </div>
        <div
          style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}
        >
          <IconFont
            style={{ fontSize: '16px', marginRight: '6px' }}
            type="phone"
          />
          {phone}
        </div>
      </div>
    </Box>
  )
}

export default PeopleCard
