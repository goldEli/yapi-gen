import styled from '@emotion/styled'
import { css } from '@emotion/css'

import React, { useState } from 'react'
import ScheduleInfoIcon from '../ScheduleInfoIcon'
import { useSelector, useDispatch } from '@store/index'
import IconFont from '@/components/IconFont'
const ScheduleInfoContentBox = styled.div`
  padding: 16px;
  max-height: 460px;
  overflow-y: scroll;
`
const ScheduleInfoContentItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
`
const tip = css`
  color: var(--neutral-n1-d1);
  font-size: var(--font12);
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  img {
    width: 24px;
    height: 22px;
    margin-right: 4px;
  }
  span:nth-child(2) {
    cursor: pointer;
  }
`
const PersonList = styled.div`
  margin-left: 28px;
`
const PersonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--neutral-n2);
  font-size: var(--font12);
  img {
    width: 24px;
    height: 22px;
    margin-right: 8px;
  }
`
const FileList = styled.div`
  margin-left: 28px;
`
const FileItem = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
  border-radius: 6px 6px 6px 6px;
  margin-bottom: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  > span:nth-child(1) {
    font-size: 30px;
    margin-right: 8px;
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
`
const FileItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  span:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: var(--font14);
  }
  span:nth-child(2) {
    color: var(--neutral-n3);
    font-size: var(--font12);
  }
`
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
        <div className={tip}>
          <span>
            <img src={scheduleInfo?.creator?.avatar} />
            {scheduleInfo?.creator?.name}（所有者）
          </span>
        </div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="team" />
        </span>
        <div className={tip}>
          <span>参与者（{scheduleInfo?.members?.length}人）</span>
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
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="file-02" />
        </span>
        <div className={tip}>{scheduleInfo?.describe}</div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="attachment" />
        </span>
        <div className={tip}>文件列表</div>
      </ScheduleInfoContentItem>
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
          <div className={tip}>{item.remind_type_text}</div>
        </ScheduleInfoContentItem>
      ))}
      <ScheduleInfoContentItem>
        <span>
          <ScheduleInfoIcon type="calendar-days" />
        </span>
        <div className={tip}>{scheduleInfo?.calendar_name}</div>
      </ScheduleInfoContentItem>
    </ScheduleInfoContentBox>
  )
}

export default ScheduleInfoContent
