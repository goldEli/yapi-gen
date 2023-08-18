import styled from '@emotion/styled'
import { css } from '@emotion/css'
export const WorkHoursWrap = styled.div`
  padding: 20px 16px 0 0px;
`
export const PanelWrap = styled.div``
export const Rows = styled.div`
  display: flex;
  &.highBackground {
    background: var(--neutral-n10);
  }
`
export const Cols = styled.div`
  width: 72px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--neutral-n6-d1);
`
export const Header = styled.div`
  display: flex;
  .header-td {
    width: 72px;
    height: 28px;
    display: flex;
    align-items: center;
    color: var(--neutral-n3);
    font-size: 12px;
    border-right: 1px solid var(--neutral-n6-d1);
    border-top: 1px solid var(--neutral-n6-d1);
    padding-left: 8px;
    box-sizing: border-box;
  }
`
export const WorkHourLabel = styled.div`
  width: 48px;
  height: 22px;
  text-align: center;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Working = css`
  background: var(--function-tag2);
  color: var(--function-success);
`
export const Leave = css`
  background: var(--function-tag3);
  color: var(--function-error);
`
export const NotWorking = css`
  background: var(--function-tag4);
  color: var(--function-warning);
`
