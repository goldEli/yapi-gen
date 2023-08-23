import styled from '@emotion/styled'
import { Input } from 'antd'
import { css } from '@emotion/css'
import { DragLine, MouseDom } from '@/components/StyleCommon'
export const WorkHoursWrap = styled.div`
  padding: 20px 16px 0 0px;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

export const MianWrap = styled.div`
  display: flex;
  height: calc(100% - 240px);
  padding-left: 16px;
  justify-content: space-between;
  position: relative;
`
export const PanelWrap = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  width: 100%;
  position: relative;
  overflow-x: auto;
  .openIconBox {
    display: flex;
    position: absolute;
    left: -24px;
    top: 2px;
  }
`
export const Rows = styled.div`
  display: flex;
  &.highBackground {
    background: var(--neutral-n10);
  }
`
export const Cols = styled.div`
  min-width: 72px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--neutral-n6-d1);
  flex: 1;
`
export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`
export const DateLabel = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
  display: flex;
  .month-td {
    min-width: 72px;
    height: 28px;
    display: flex;
    align-items: center;
    color: var(--neutral-n3);
    font-size: 12px;

    box-sizing: border-box;
    /* flex: 1; */
    /* justify-content: center; */
    padding-left: 16px;
  }
`
export const TimeLabel = styled.div`
  display: flex;
  .header-td {
    min-width: 72px;
    height: 28px;
    display: flex;
    align-items: center;
    color: var(--neutral-n3);
    font-size: 12px;
    border-right: 1px solid var(--neutral-n6-d1);
    border-top: 1px solid var(--neutral-n6-d1);
    box-sizing: border-box;
    flex: 1;
    justify-content: center;
  }
`
export const WorkHourLabel = styled.div`
  min-width: 48px;
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
export const lastDay = css`
  border-right: 1px solid var(--neutral-n6-d1) !important;
  justify-content: flex-start !important;
`
export const Leave = css`
  background: var(--function-tag3);
  color: var(--function-error);
`
export const NotWorking = css`
  background: var(--function-tag4);
  color: var(--function-warning);
`
export const Line = styled(DragLine)<{ active: boolean }>`
  background: ${props =>
    props.active ? 'var(--primary-d2)' : 'var(--neutral-n6-d1)'}!important;
  &:hover {
    background: var(--primary-d2) !important;
  }
  margin-left: 0px;
`
export const SprintDetailMouseDom = styled(MouseDom)`
  background: transparent;
`
export const UpdateTask = styled.div`
  width: 240px;
  height: 235px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  .title {
    height: 22px;
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
    margin-bottom: 8px;
  }
  .form-box {
    flex: 1;
    .ant-radio-wrapper {
      font-size: 14px;
      color: var(--neutral-n1-d1);
      font-family: SiYuanMedium;
    }
  }
  .btn-box {
    height: 24px;
    /* border: 1px solid red; */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-left: 8px;
    }
  }
`
export const StatusWrap = styled.div<{ state: number }>(
  {
    width: 8,
    height: 8,
    borderRadius: '50%',
    fontSize: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginRight: 4,
  },
  ({ state }) => ({
    cursor: 'pointer',
    color: 'var(--neutral-n1-d1)',
    background:
      state === 1
        ? 'var(--auxiliary-b1)'
        : state === 2
        ? 'var(--neutral-n7)'
        : state === 3
        ? 'var(--function-success)'
        : '',
  }),
)
export const CanOperation = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  minHeight: 32,
  flex: 1,
  cursor: 'pointer',
  justifyContent: 'flex-start',
  padding: '0 8px',
  '.text': {
    display: 'inline-block',
    minWidth: '123px',
    width: '80%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})
export const StateWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.icon': {
    opacity: 0,
  },
  '&:hover': {
    '.icon': {
      opacity: 1,
    },
  },
})

export const State = styled.div<{ state: boolean }>(
  {
    fontSize: '14px',
  },
  ({ state }) => ({
    cursor: state ? 'pointer' : 'inherit',
    color: state ? 'var(--function-error)' : 'var(--neutral-n1-d1)',
  }),
)
export const PopoverWrap = styled.div({
  fontSize: '14px',
  color: 'var(--neutral-white-d7)',
  padding: 12,
  minWidth: '240px',
  minHeight: '134px',
  background: 'rgba(0,0,0,0.6)',
  borderRadius: '6px',
})
export const Text = styled.div<{ state: number }>(({ state }) => ({
  fontSize: state === 3 ? '14px' : '12px',
  color:
    state === 1
      ? 'var(--neutral-n6-d1)'
      : state === 3
      ? 'var(--neutral-n1-d1)'
      : 'var(--neutral-n4)',
  marginBottom: state === 1 ? '12px' : state === 3 ? '8px' : 0,
  marginLeft: state === 3 ? '24px' : 0,
}))
export const InputStyle = styled(Input.TextArea)({
  width: '480px',
  minHeight: '148px',
  marginLeft: '24px',
})
