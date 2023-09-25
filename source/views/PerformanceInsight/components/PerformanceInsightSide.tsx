/* eslint-disable react/no-unstable-nested-components */
import CommonIconFont from '@/components/CommonIconFont'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Wrap = styled.div`
  height: 100%;
  padding-top: 16px;
`
const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
    color: var(--primary-d2) !important;
  }
  div {
    margin-left: 12px;
  }
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n3'};
  }
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
`

const PerformanceInsightSide = (props: { overPageType?: string }) => {
  const navigate = useNavigate()
  const [defaultKey, setDefaultKey] = useState<any>(props.overPageType)
  const { currentMenu } = useSelector(store => store.user)

  const side: any = [
    {
      label: 'Kanban',
      key: 'kanBan',
      icon: 'layout',
      path: '/Performance',
      permission:
        currentMenu?.children?.filter(
          (i: any) => i.permission === 'b/company/kanban',
        )?.length > 0,
    },
    {
      label: '报表',
      key: 'report',
      icon: 'pie-chart-02',
      path: '/Performance',
      permission:
        currentMenu?.children?.filter(
          (i: any) => i.permission === 'b/efficiency',
        )?.length > 0,
    },
  ]

  const onMenuClick = (i: any) => {
    setDefaultKey(i.key)
    const params = encryptPhp(
      JSON.stringify({ isOverAll: true, overPageType: i.key }),
    )
    navigate(`/Performance?data=${params}`)
  }

  return (
    <Wrap>
      {side.map((i: any) => (
        <MenuItem
          key={i.key}
          isActive={defaultKey === i.key}
          onClick={() => onMenuClick(i)}
          hidden={!i.permission}
        >
          <CommonIconFont type={i.icon} size={18} color="var(--neutral-n3)" />
          <div>{i.label}</div>
        </MenuItem>
      ))}
    </Wrap>
  )
}

export default PerformanceInsightSide
