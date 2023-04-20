import styled from '@emotion/styled'
import { css } from '@emotion/css'
export const ScheduleSearchWrap = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  align-items: center;
  margin-bottom: 40px;
  > span {
    height: 40px !important;
  }
`
export const ScheduleSearchListBox = styled.div`
  background-color: #fff;
  overflow-y: auto;
  height: 800px;
  position: relative;
  padding: 24px 50px;
  box-sizing: border-box;
`
export const BackBox = styled.div`
  width: 60px;
  color: var(--neutral-n3);
  font-size: var(--font12);
  cursor: pointer;
  span {
    margin-right: 8px;
  }
`
export const CalendarListItem = styled.div`
  border-top: 1px solid var(--neutral-n6-d1);
  display: flex;
  padding: 12px 0px;
  align-items: flex-start;
`
export const DateBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font18);
  font-weight: 500;
  width: 40px;
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
  top: 6px;
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
  padding-left: 20px;
  &:before {
    position: absolute;
    content: '';
    left: 10px;
    top: 11px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary-d1);
  }
  &:hover {
    background: var(--neutral-n6-d1);
    border-radius: 6px;
    cursor: pointer;
  }
  span:nth-of-type(3) {
    color: var(--function-warning);
    font-size: var(--font16);
    position: relative;
    top: 1px;
  }
`
export const CalendarListClass = css`
  :last-child {
    border-bottom: 1px solid var(--neutral-n6-d1) !important;
  }
  :first-child {
    border-top: none;
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
  text-align: center !important;
  display: inline-block;
  width: 28px !important;
  height: 28px !important;
`
export const contentHigh = css`
  /* color: var(--primary-d1); */
`