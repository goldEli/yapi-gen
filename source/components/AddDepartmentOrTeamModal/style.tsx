import styled from '@emotion/styled'
import DirectoryTree from 'antd/lib/tree/DirectoryTree'

// 添加成员弹窗
export const ContentBox = styled.div`
  width: 640px;
  display: flex;
  height: 448px;
  justify-content: space-between;
`

export const ContentLeft = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  padding-right: 4px;
  border-right: 1px solid var(--neutral-n6-d1);
`

export const TreeStyle = styled(DirectoryTree)`
  width: 214px;
  height: 410px;
  overflow-y: auto;
  margin-top: 8px;
  .ant-tree-checkbox-inner {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background-color: var(--primary-d1);
    border-color: var(--primary-d1);
  }
  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
    background-color: var(--auxiliary-b2);
  }
  & .ant-tree-iconEle {
    display: none !important;
  }
  .ant-tree-treenode {
    min-width: 216px;
    height: 44px;
    padding-left: 16px;
    /* overflow: hidden; */
  }

  .ant-tree-treenode:hover {
    border-radius: 6px;
    background-color: var(--hover-d2);
    .ant-tree-title div {
      color: var(--neutral-n1-d1) !important;
    }
  }
  .ant-tree.ant-tree-directory .ant-tree-treenode-selected:hover::before,
  .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
    background-color: none;
  }
`

export const LeftItems = styled.div`
  width: 100%;
  height: 356px;
  overflow: auto;
  padding-right: 16px;
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ecedef;
  }
`

export const LeftItem = styled.div`
  border-radius: 6px;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  cursor: pointer;
  div {
    margin-left: 12px;
    width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  :hover {
    background-color: var(--hover-d2);
  }
`

export const ContentRight = styled.div`
  width: 320px;
  height: 100%;
  padding: 0 24px;
`

export const CheckBoxWrap = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 12px;
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
  width: 272px;
  height: calc(100% - 36px);
  overflow: auto;
  margin-top: 16px;
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
  padding: 0 12px;
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
