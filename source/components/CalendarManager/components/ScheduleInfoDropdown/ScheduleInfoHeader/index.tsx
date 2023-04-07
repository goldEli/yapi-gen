import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector,useDispatch } from '@store/index'
import { setIsShowScheduleVisible} from '@store/calendar'
import { Dropdown } from 'antd'
import React from 'react'
import ScheduleInfoIcon from './../ScheduleInfoIcon'
interface ScheduleInfoDropdownProps { }
const ScheduleInfoHeader = styled.div`
  height: 136px;
  background-color: var(--primary-d1);
  padding: 16px;
  box-sizing: border-box;
  border-radius: 6px 6px 0 0;
`
const ScheduleInfoHeaderBtns = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
`
const ScheduleInfoHeaderContent = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font14);
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  margin-bottom: 8px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`
const ScheduleInfoHeaderDate = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font12);
`
const statusClass = css`
  width: 40px;
  height: 22px;
  background: rgba(255,255,255,0.2);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  text-align: center;
  color: var(--neutral-white-d7);
  font-size: var(--font12);
  line-height: 22px;
  ;
`
const iconBox=css`
  display: flex;
  span{
    margin-left: 6px;
    color: var(--neutral-white-d6);
  }
  span:nth-child(3){
    position: relative;
    top: -4px;
  }
`
const ScheduleInfoHeaderBox: React.FC<ScheduleInfoDropdownProps> = props => {
  const disPatch=useDispatch()
  return (
      <ScheduleInfoHeader>
        <ScheduleInfoHeaderBtns>
          <span className={statusClass}>忙碌</span>
          <div className={iconBox}>
            <span onClick={()=>{
              console.log(1)
              disPatch(setIsShowScheduleVisible(true))
            }}><ScheduleInfoIcon type='edit' /></span><span><ScheduleInfoIcon type='delete' /></span><span>...</span><span><ScheduleInfoIcon type='close' /></span>
          </div>
        </ScheduleInfoHeaderBtns>
        <ScheduleInfoHeaderContent>
          日程标题日程标题日程标题日程标题日程标题dsadsadasdsadsadsad
          日程标题日程标题日程标题日程标题日程标.dsadhsadsaadsadasdsadsadsadsas
        </ScheduleInfoHeaderContent>
        <ScheduleInfoHeaderDate>
          3月16 (周三) 15:09 - 3月17 (周五) 16:00
        </ScheduleInfoHeaderDate>
      </ScheduleInfoHeader>
  )
}

export default ScheduleInfoHeaderBox
