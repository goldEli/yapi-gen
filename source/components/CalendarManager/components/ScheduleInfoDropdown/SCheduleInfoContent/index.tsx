import { css } from '@emotion/css'

import React, { useState } from 'react'
import ScheduleInfoIcon from '../ScheduleInfoIcon'
import { useSelector, useDispatch } from '@store/index'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import UploadAttach from '@/components/UploadAttach'
import { setShowScheduleInfoTip } from '@store/schedule'
import defaultImage from '/public/light.png'
import {
  ScheduleInfoContentBox,
  ScheduleInfoContentItem,
  contentTip,
  PersonList,
  PersonItem,
  FileList,
  FileItem,
  FileItemInfo,
} from '../styles'
const toggleDropUp = css`
  max-height: 0;
  overflow-y: hidden;
  transition: all 0.3s;
  color: var(--neutral-n3) !important;
  font-size: var(--font16) !important;
`
const toggleDropDown = css`
  /* max-height: auto; */
  max-height: 30vh;
  transition: all 0.3s;
  color: var(--neutral-n3) !important;
  font-size: var(--font16) !important;
`
const hover = css`
  height: 30px;
  display: flex;
  align-items: center !important;
  margin: 0px 14px;
  margin-right: 6px;
  padding-left: 3px !important;
  &:hover {
    background: var(--hover-d3);
    border-radius: 6px;
  }
  .icon {
    position: relative;
    top: 3px !important;
  }
`
interface IProps {
  showFooter: boolean
}
const ScheduleInfoContent: React.FC<IProps> = props => {
  const { scheduleInfo } = useSelector(state => state.schedule)
  const [toggleStatus, setToggleStatus] = useState(false)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  return (
    <ScheduleInfoContentBox
      showFooter={props.showFooter}
      onClick={() => {
        dispatch(setShowScheduleInfoTip(false))
      }}
    >
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="database" />
        </span>
        <div className={contentTip}>
          <span>
            <img
              src={
                scheduleInfo?.user?.avatar
                  ? scheduleInfo.user?.avatar
                  : defaultImage
              }
            />
            <span className="username">
              {scheduleInfo?.user?.name}（{t('calendarManager.owner')}）
            </span>
          </span>
        </div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem
        className={hover}
        onClick={() => setToggleStatus(!toggleStatus)}
        style={{ cursor: 'pointer' }}
      >
        <span>
          <ScheduleInfoIcon type="team" />
        </span>
        <div className={contentTip}>
          <span>
            {t('calendarManager.participant')}（{scheduleInfo?.members?.length}
            {t('people')}）
          </span>
          <span onClick={e => {}} className="icon">
            <IconFont
              style={{ fontSize: '16px', color: 'var(--neutral-n3)' }}
              type={toggleStatus ? 'up' : 'down'}
            />
          </span>
        </div>
      </ScheduleInfoContentItem>
      {scheduleInfo?.members?.length ? (
        <PersonList className={toggleStatus ? toggleDropUp : toggleDropDown}>
          {scheduleInfo?.members?.map((item, idx) => (
            <PersonItem key={item.user_id}>
              <span>
                <img
                  src={item.user?.avatar ? item.user?.avatar : defaultImage}
                />
                {item.user?.name}
              </span>
              <span>{item.status_text}</span>
            </PersonItem>
          ))}
        </PersonList>
      ) : null}

      {scheduleInfo?.describe ? (
        <ScheduleInfoContentItem>
          <span>
            <ScheduleInfoIcon type="file-02" />
          </span>
          <div className={contentTip}>{scheduleInfo?.describe}</div>
        </ScheduleInfoContentItem>
      ) : null}
      {scheduleInfo?.files?.length ? (
        <ScheduleInfoContentItem>
          <span>
            <ScheduleInfoIcon type="attachment" />
          </span>
          <div className={contentTip}>{t('calendarManager.file_list')}</div>
        </ScheduleInfoContentItem>
      ) : null}
      {scheduleInfo?.files?.length ? (
        <FileList>
          <UploadAttach
            power
            isReport
            defaultList={scheduleInfo?.files?.map((i: any) => ({
              url: i.url,
              id: new Date().getTime() + Math.random() + i.user_id,
              size: Math.abs(i.size),
              time: i.created_at,
              name: i.name || '--',
              suffix: i.suffix,
              username: i.user.name ?? '--',
            }))}
            onChangeAttachment={() => {}}
          ></UploadAttach>
        </FileList>
      ) : null}

      {scheduleInfo?.reminds?.map((item, idx) => (
        <ScheduleInfoContentItem key={idx}>
          <span>
            <ScheduleInfoIcon type="alarm" />
          </span>
          <div className={contentTip}>{item.remind_type_text}</div>
        </ScheduleInfoContentItem>
      ))}
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="calendar-days" />
        </span>
        <div className={contentTip}>{scheduleInfo?.calendar_name}</div>
      </ScheduleInfoContentItem>
    </ScheduleInfoContentBox>
  )
}

export default ScheduleInfoContent
