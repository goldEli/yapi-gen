import styled from '@emotion/styled'
import exp from 'constants'

export const HeaderStyle = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d2);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const BackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--hover-d2);
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2);
    }
  }
`
export const ChangeIconGroup = styled.div`
  /* border: 1px solid var(--neutral-n6-d1); */
  border-radius: 6px;
  box-sizing: border-box;
  height: 32px;
  display: flex;
`
export const NextWrap = styled.div`
  width: 31px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    border: 1px solid var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`
export const UpWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-right: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DownWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-left: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
`
export const MainStyle = styled.div`
  padding: 24px;
`
export const UserMsg = styled.div`
  display: flex;
  align-items: center;
`
export const UserInfo = styled.div`
  margin-left: 12px;
  font-size: 16px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
  .msg {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n3);
    font-family: MiSans-Regular, MiSans;
  }
`
export const FilterType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0;
`
export const Text = styled.span`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
  .text {
    margin-right: 8px;
  }
  &:hover {
    cursor: pointer;
  }
`
export const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
`
export const TableStyle = styled.div`
  height: 408px;
  overflow-y: auto;
  padding: 24px 24px 0 24px;
`
