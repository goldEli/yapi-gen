import styled from '@emotion/styled'

// 添加成员弹窗
export const ContentBox = styled.div`
  width: 528px;
  display: flex;
  height: 448px;
  justify-content: space-between;
`

export const ContentLeft = styled.div`
  width: 264px;
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  padding-right: 4px;
  border-right: 1px solid var(--neutral-n6-d1);
`

export const LeftItems = styled.div`
  width: 100%;
  height: calc(100% - 36px);
  overflow: auto;
  padding-right: 20px;
`

export const LeftItem = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  cursor: pointer;
  div {
    margin-left: 12px;
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

export const ContentRight = styled.div`
  width: 264px;
  height: 100%;
  padding: 0 24px;
`

export const CheckBoxWrap = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  margin-top: 16px;
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primary-d1);
    border-color: var(--primary-d1);
  }
  span {
    color: var(--neutral-n2);
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  height: 36px;
  background: var(--neutral-n7);
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  & span:first-child {
    color: var(--neutral-n1-d1);
  }
  & span:last-child {
    color: var(--primary-d2);
  }
  & span:last-child:hover {
    cursor: pointer;
  }
`

export const ListWraps = styled.div`
  width: 216px;
  height: calc(100% - 36px);
  overflow: auto;
`

export const IconWrap = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: var(--neutral-white-d7);
  font-size: 16px;
`

export const ListItem = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 6px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    max-width: 76%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .otherType {
    display: flex;
    align-items: center;
    max-width: 90%;
  }
  .teamIcon {
    background: #98ace0 !important;
  }
  .departmentIcon {
    background: #79d1c1 !important;
  }
  .closeIcon {
    visibility: hidden;
  }
  &:hover {
    background: var(--hover-d2);
    cursor: pointer;
    .closeIcon {
      visibility: visible;
    }
  }
`
