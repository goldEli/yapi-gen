import IconFont from '@/components/IconFont'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { t } from 'i18next'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Box = styled.div`
  max-width: 400px;
  min-width: 283px;
  padding: 12px;
  background-image: url('/bg_23.png');
  cursor: pointer;
  background-size: cover;
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
  const navigate = useNavigate()
  const { theme } = useSelector(store => store.global)

  // 跳转到员工概况
  const onToEmployee = (e: any) => {
    e.stopPropagation()
    // EmployeeProfile
    const params = encryptPhp(
      JSON.stringify({
        user_id: props.id,
      }),
    )
    navigate(`/EmployeeProfile?data=${params}`)
  }

  return (
    <Box onClick={e => onToEmployee(e)}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px' }}>
            {name}（{position}）
          </div>
          <div style={{ fontSize: '12px' }}>{company}</div>
        </div>
        <img
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          src={
            avatar ||
            (theme === 1
              ? 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/dark.pnp'
              : 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png')
          }
          alt=""
        />
      </div>
      <div style={{ display: 'flex', marginTop: '12px' }}>
        <div style={{ flex: '50%' }}>
          <div style={{ fontSize: '12px' }}>{completed_rate}%</div>
          <div style={{ fontSize: '12px' }}>
            {t('taskCompletionRate') as string}
          </div>
        </div>
        <div style={{ flex: '50%' }}>
          <div style={{ fontSize: '12px' }}>{undone_num}</div>
          <div style={{ fontSize: '12px' }}>
            {t('tasksToBeCompleted') as string}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid rgba(255,255,255,0.5)',
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
              marginTop: '2px',
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
