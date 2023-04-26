import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { scheduleInfoReply } from '@/services/schedule'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import { useTranslation } from 'react-i18next'
import { refreshCalendarPanelScheduleList } from '@store/schedule/schedule.thunk'
import { divide } from 'lodash'
interface iProps {}
const ScheduleInfoFooterBox = styled.div`
  color: var(--neutral-n3);
  display: flex;
  align-items: start;
  justify-content: flex-end;
  padding-right: 16px;
  box-sizing: border-box;
  position: fixed;
  right: 0px;
  position: fixed;
  bottom: 24px;
  right: 0px;
  button {
    margin-left: 16px;
  }
`

const ScheduleInfoFooter: React.FC<iProps> = props => {
  const [t] = useTranslation()
  const { scheduleInfo } = useSelector(state => state.schedule)
  const disPatch = useDispatch()
  const replySchedule = async (status: number) => {
    try {
      await scheduleInfoReply({ id: scheduleInfo?.id ?? 0, status })
      disPatch(setScheduleInfoDropdown({ visible: false }))
      disPatch(refreshCalendarPanelScheduleList())
    } catch (error) {
      //
    }
  }
  return (
    <>
      {scheduleInfo?.is_show_reply ? (
        <ScheduleInfoFooterBox>
          <CommonButton type="light" onClick={() => replySchedule(1)}>
            {t('calendarManager.receive')}
          </CommonButton>
          <CommonButton type="light" onClick={() => replySchedule(2)}>
            {t('calendarManager.refuse')}
          </CommonButton>
          <CommonButton type="light" onClick={() => replySchedule(3)}>
            {t('calendarManager.pending')}
          </CommonButton>
        </ScheduleInfoFooterBox>
      ) : null}
    </>
  )
}

export default ScheduleInfoFooter
