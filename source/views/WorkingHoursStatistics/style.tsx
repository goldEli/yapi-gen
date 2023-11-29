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
export const LeftWrap = styled.div`
  position: relative;
  height: 100%;
  .openIconBox {
    display: flex;
    position: absolute;
    right: 8px;
    top: -10px;
  }
`
export const MianWrap = styled.div`
  display: flex;
  height: calc(100% - 240px);
  padding-left: 16px;
  justify-content: space-between;
  .openIconBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: transparent;
    .anticon {
      color: var(--neutral-n3);
    }
  }
  .openIconBox:hover {
    background-color: var(--hover-d1);
    .anticon {
      color: var(--neutral-n1-d1);
    }
  }
`
export const PanelWrap = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  width: 100%;
  height: calc(100% + 12px);
  position: relative;
  overflow-x: auto;
`
export const Rows = styled.div<{ scrollWidth: number }>`
  display: flex;
  &.highBackground {
    background: var(--neutral-n10);
    width: ${props => `calc(100% + ${props.scrollWidth}px)`};
  }
`
export const Cols = styled.div<{ language?: string | null }>`
  min-width: ${props => (props.language === 'en' ? '125px' : '72px')};
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--neutral-n6-d1);
  flex: 1;
  padding: 0px 8px;
`
export const HeaderWrap = styled.div<{ scrollWidth: number }>`
  position: sticky;
  top: 0px;
  background: #fff;
  /* width: calc(100% +scrollWidth); */
  width: ${props => `calc(100% + ${props.scrollWidth}px)`};
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
    /* min-width: 125px; */
    height: 28px;
    display: flex;
    align-items: center;
    color: var(--neutral-n3);
    font-size: 12px;
    box-sizing: border-box;
    /* flex: 1; */
    /* justify-content: center; */
    padding-left: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
export const TimeLabel = styled.div<{ language?: string | null }>`
  display: flex;
  .header-td {
    min-width: ${props => (props.language === 'en' ? '125px' : '72px')};
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
  padding: 4px 8px;
  flex-shrink: 0;
`
export const Working = css`
  background: var(--function-tag2);
  color: var(--neutral-n2);
  &:hover {
    color: var(--function-success);
  }
`
export const lastDay = css`
  border-right: 1px solid var(--neutral-n6-d1) !important;
  justify-content: flex-start !important;
  color: var(--neutral-n2);
`
export const Leave = css`
  background: var(--function-tag3);
  color: var(--neutral-n2);
  &:hover {
    color: var(--function-error);
  }
`
export const NotWorking = css`
  background: var(--function-tag4);
  color: var(--neutral-n2);
  &:hover {
    color: var(--function-warning);
  }
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
  height: calc(100% + 12px);
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
      /* font-family: SiYuanMedium; */
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
    maxWidth: '400px',
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
  '.title': {
    fontSize: 14,
    fontFamily: 'SiYuanMedium',
  },
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
export const MemberTipBOX = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font14);
  height: 22px;
  margin-top: 4px;
`
