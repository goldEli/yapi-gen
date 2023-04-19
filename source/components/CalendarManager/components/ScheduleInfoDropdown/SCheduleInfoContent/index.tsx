import { css } from '@emotion/css'

import React, { useState } from 'react'
import ScheduleInfoIcon from '../ScheduleInfoIcon'
import { useSelector, useDispatch } from '@store/index'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
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
`
const toggleDropDown = css`
  max-height: auto;
`
const ScheduleInfoContent: React.FC = props => {
  const { scheduleInfo } = useSelector(state => state.schedule)
  const [toggleStatus, setToggleStatus] = useState(false)
  const [t] = useTranslation()
  const [fileType, setFileType] = useState({
    docx: 'colorDOC-76p4mioh',
    ppt: 'colorPPT',
    pdf: 'colorpdf',
    video: 'colorvideo',
    zip: 'zip',
  })
  return (
    <ScheduleInfoContentBox>
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="database" />
        </span>
        <div className={contentTip}>
          <span>
            <img src={scheduleInfo?.user?.avatar} />
            {scheduleInfo?.user?.name}（{t('calendarManager.owner')}）
          </span>
        </div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="team" />
        </span>
        <div className={contentTip}>
          <span>
            {t('calendarManager.participant')}（{scheduleInfo?.members?.length}
            人）
          </span>
          <span
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <IconFont
              onClick={() => setToggleStatus(!toggleStatus)}
              style={{ fontSize: '18px' }}
              type={toggleStatus ? 'up' : 'down'}
            />
          </span>
        </div>
      </ScheduleInfoContentItem>
      <PersonList className={toggleStatus ? toggleDropUp : toggleDropDown}>
        {scheduleInfo?.members?.map((item, idx) => (
          <PersonItem key={item.user_id}>
            <span>
              <img src={item.user?.avatar} />
              {item.user?.name}
            </span>
            <span>{item.status_text}</span>
          </PersonItem>
        ))}
      </PersonList>
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
          <div className={contentTip}>文件列表</div>
        </ScheduleInfoContentItem>
      ) : null}

      <FileList>
        {scheduleInfo?.files?.map((item, index) => (
          <FileItem key={index}>
            <span>
              <IconFont
                type={
                  fileType[
                    item.url.substring(
                      item.url.lastIndexOf('.') + 1,
                    ) as keyof typeof fileType
                  ] || 'colorunknown'
                }
              />
            </span>
            <FileItemInfo>
              <span>
                {decodeURIComponent(
                  item.url.substring(item.url.lastIndexOf('/') + 1),
                )}
              </span>
              <span>
                {item.user.name} {item.created_at}
              </span>
            </FileItemInfo>
          </FileItem>
        ))}
      </FileList>
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
