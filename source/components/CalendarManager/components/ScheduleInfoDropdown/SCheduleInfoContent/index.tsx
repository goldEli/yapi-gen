import styled from '@emotion/styled'
import { css } from '@emotion/css'

import React from 'react'
import ScheduleInfoIcon from '../ScheduleInfoIcon'
const ScheduleInfoContentBox = styled.div`
    padding: 16px;
    max-height: 400px;
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
  justify-content:space-between;
  width: 100%;
  img{
    width: 24px;
    height: 22px;
    margin-right: 4px;
  }
  span:nth-child(2){
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
  img{
    width: 24px;
    height: 22px;
    margin-right: 8px;
  }
`
const FileList = styled.div`
  margin-left: 28px;
`
const FileItem = styled.div`
  height: 60px;
  background: #FFFFFF;
  box-shadow: 0px 0px 7px 0px rgba(0,0,0,0.06);
  border-radius: 6px 6px 6px 6px;
  margin-bottom: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  img{
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
`
const FileItemInfo=styled.div`
  display: flex;
  flex-direction:column;
  span:nth-child(1){
    color: var(--neutral-n1-d1);
    font-size: var(--font14);
  }
  span:nth-child(2){
    color: var(--neutral-n3);
    font-size: var(--font12);
  }
`
const ScheduleInfoContent: React.FC = props => {
  return (
    <ScheduleInfoContentBox>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="database" /></span>
        <div className={tip}>
          <span><img src='https://img95.699pic.com/photo/50133/0843.jpg_wh300.jpg' />易烊千玺（所有者）</span></div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="team" /></span>
        <div className={tip}>
          <span>参与者（3人）</span><span onClick={(e)=>{
            e.stopPropagation()
          }}><ScheduleInfoIcon type="up"  /></span></div>
      </ScheduleInfoContentItem>
      <PersonList>
        {
          [1, 2, 3].map((item, idx) => <PersonItem key={idx}>
            <span><img src='https://img95.699pic.com/photo/50133/0843.jpg_wh300.jpg' />胡歌</span>
            <span>未回复</span>
          </PersonItem>)
        }

      </PersonList>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="file-02" /></span>
        <div className={tip}>这是一段介绍文字这是一段介绍文字这是一段介绍文字的发生那时的那是你的sands</div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="attachment" /></span>
        <div className={tip}>文件列表</div>
      </ScheduleInfoContentItem>
       <FileList>
        {
          [1,2].map((item,index)=><FileItem key={index}>
             <span><img src='https://img95.699pic.com/photo/50133/0843.jpg_wh300.jpg' /></span>
              <FileItemInfo>
                <span>这是一个图片.jpg</span>
                <span>张三 2020-11-12 10:40:00</span>
              </FileItemInfo>
          </FileItem>)
        }
       </FileList>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="alarm" /></span>
        <div className={tip}>提前15分钟</div>
      </ScheduleInfoContentItem>
      <ScheduleInfoContentItem>
        <span><ScheduleInfoIcon type="calendar-days" /></span>
        <div className={tip}>我的日历</div>
      </ScheduleInfoContentItem>
    </ScheduleInfoContentBox>
  )
}

export default ScheduleInfoContent
