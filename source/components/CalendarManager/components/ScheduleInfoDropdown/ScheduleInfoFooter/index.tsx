import styled from '@emotion/styled'
import { css } from '@emotion/css'
import CommonButton from '@/components/CommonButton'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { scheduleInfoReply } from '@store/schedule/schedule.thunk'
interface iProps {}
const ScheduleInfoFooterBox = styled.div`
  color: var(--neutral-n3);
  display: flex;
  align-items: start;
  justify-content: flex-end;
  padding-right: 16px;
  box-sizing: border-box;
  button {
    margin-left: 16px;
  }
`

const ScheduleInfoFooter: React.FC<iProps> = props => {
  const disPatch = useDispatch()
  const { scheduleInfo } = useSelector(state => state.schedule);
  console.log(scheduleInfo)
  const replySchedule = (status: number) => {
    disPatch(scheduleInfoReply({ id: scheduleInfo?.id as any, status }))
  }
  return (
    <>
      {scheduleInfo?.is_show_reply? (
        <ScheduleInfoFooterBox>
          <CommonButton type="light" onClick={() => replySchedule(1)}>
            接收
          </CommonButton>
          <CommonButton type="light" onClick={() => replySchedule(2)}>
            拒绝
          </CommonButton>
          <CommonButton type="light" onClick={() => replySchedule(3)}>
            待定
          </CommonButton>
        </ScheduleInfoFooterBox>
      ) : null}
    </>
  )
}

export default ScheduleInfoFooter
