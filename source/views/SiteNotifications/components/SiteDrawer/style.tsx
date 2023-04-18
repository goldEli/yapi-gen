import styled from '@emotion/styled'

export const Wrap = styled.div`
  position: relative;
  padding-top: 56px;
  height: 100%;
  padding-bottom: 100px;
`

export const TabsWrap = styled.div`
  position: relative;
  width: 322px;
  padding: 2px;
  display: flex;
  background-color: var(--hover-d2);
  border-radius: 4px;
`

export const ActiveTab = styled.div`
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 50px;
  padding: 4px 16px;
  border-radius: 4px;
  height: 30px;

  background: var(--neutral-white-d6);
  transition: left 0.4s;
`

export const TabsWrapItem = styled.div<{ active: boolean }>`
  z-index: 1;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  /* background: ${props =>
    props.active ? 'var(--neutral-white-d6);' : ''}; */
  color: ${props => (props.active ? 'var(--primary-d2);' : '')};
  transition: all 0.5s;
`

export const CloseWrap = styled.div<{ width?: any; height?: any }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  margin-left: 16px;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`
export const GrepTitle = styled.span`
  color: var(--neutral-n3);
  font-size: 12px;
`

export const Tips = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 20px;
  display: flex;
  justify-content: center;
`

export const MyFooter = styled.div`
  margin-top: 8px;
  border-top: 1px solid var(--neutral-n6-d2);
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
