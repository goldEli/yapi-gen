import React from 'react'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

interface MoreScheduleButtonProps {
  hiddenNum: number
  onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void
}

const MoreScheduleButtonBox = styled.div`
  font-size: 12px;

  color: var(--neutral-n3);
  display: flex;
  height: 20px;
  overflow: hidden;
`
const Text = styled.span`
  cursor: pointer;
`

const MoreScheduleButton: React.FC<MoreScheduleButtonProps> = props => {
  const [t] = useTranslation()
  if (!props.hiddenNum) {
    return <></>
  }
  return (
    <MoreScheduleButtonBox>
      <Text onClick={props.onClick}>
        {t('calendarManager.moreItems', {
          count: props.hiddenNum,
        })}
      </Text>
    </MoreScheduleButtonBox>
  )
}

export default MoreScheduleButton
