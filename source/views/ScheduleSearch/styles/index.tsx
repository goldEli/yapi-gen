import styled from '@emotion/styled'
import { css } from '@emotion/css'

export const ScheduleSearchListBox = styled.div`
  background-color: #fff;
  overflow-y: scroll;
  position: relative;
  padding: 24px 50px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
`
export const ScheduleSearchWrap = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  margin-bottom: 40px;
  > span {
    height: 40px !important;
  }
`
export const BackBox = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:hover {
    color: var(--primary-d2);
    border-radius: 4px;
  }
  span {
    margin-right: 4px;
    font-size: var(--font16);
  }
`
export const CalendarListItem = styled.div`
  border-top: 1px solid var(--neutral-n6-d1);
  display: flex;
  padding: 12px 0px;
  align-items: flex-start;
  padding-left: 12px;
`
export const DateBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font18);
  width: 28px;
  height: 28px;
  margin-right: 12px;
  text-align: center;
`
export const MonthWeekBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  margin-top: 6px;
`
// 农历日期组件
export const LunarDate = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-left: 4px;
  margin-top: 6px;
`
export const CalendarListInfo = styled.div`
  position: relative;
  width: calc(100% - 250px);
  margin-left: 100px;
  align-items: center;
`
export const TimeItem = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  position: relative;
  height: 30px;
  line-height: 30px;
  padding-left: 24px;
  &:hover {
    background: ${props => props.color};
    border-radius: 6px;
    cursor: pointer;
  }
  span:nth-of-type(3) {
    color: var(--function-warning);
    font-size: var(--font16);
    position: relative;
    top: 1px;
    margin-left: 9px;
  }
`
export const Dot = styled.div<{ color: string }>`
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  background: ${props => props.color};
  border-radius: 2px 2px 2px 2px;
  left: 10px;
  margin-top: -3px;
`
export const CalendarListClass = css`
  :last-child {
    border-bottom: 1px solid var(--neutral-n6-d1) !important;
  }
  :first-child {
    border-top: none;
    padding-left: 6px;
  }
`
export const dateClass = css`
  margin-right: 65px;
  display: inline-block;
  width: 140px;
`
export const currentClass = css`
  background: var(--primary-d1) !important;
  border-radius: 50% !important;
  color: #fff !important;
  font-size: var(--font18) !important;
  display: inline-block;
  text-align: center;
  line-height: 28px;
`
export const contentHigh = css`
  /* color: var(--primary-d1); */
`
