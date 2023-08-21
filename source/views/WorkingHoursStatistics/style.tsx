import styled from '@emotion/styled'
import { Input } from 'antd'
import { css } from '@emotion/css'
export const WorkHoursWrap = styled.div`
  padding: 20px 16px 0 0px;
  height: 100%;
`

export const MianWrap = styled.div`
  display: flex;
  height: calc(100% - 200px);
  padding-left: 16px;
  justify-content: space-between;
`
export const PanelWrap = styled.div`
  /* border: 1px solid red; */
  border-left: 1px solid var(--neutral-n6-d1);
`
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
  flex-wrap: wrap;
  flex-direction: column;
`
export const DateLabel = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
  padding-left: 16px;
  margin-bottom: 4px;
`
export const TimeLabel = styled.div`
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

export const State = styled.div<{ state: number }>(
  {
    fontSize: '14px',
  },
  ({ state }) => ({
    cursor: state === 3 || state === 2 ? 'pointer' : 'inherit',
    color: state === 3 ? 'var(--function-error)' : 'var(--neutral-n1-d1)',
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
