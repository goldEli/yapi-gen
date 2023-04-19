import React from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

interface MoreScheduleButtonProps {
  hiddenNum: number
}

const MoreScheduleButtonBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  display: flex;
  height: 20px;
  overflow: hidden;
  cursor: pointer;
`

const MoreScheduleButton: React.FC<MoreScheduleButtonProps> = props => {
  const [t] = useTranslation()
  if (!props.hiddenNum) {
    return <></>
  }
  return (
    <MoreScheduleButtonBox>
      {t('calendarManager.moreItems', {
        count: props.hiddenNum,
      })}
    </MoreScheduleButtonBox>
  )
}

export default MoreScheduleButton
