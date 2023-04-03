import styled from '@emotion/styled'
import { Form } from 'antd'

export const FormWrap = styled(Form)`
  height: 60vh;
  overflow: auto;
  padding: 0 16px 0 24px;
`

export const PermissionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .select {
    width: 92%;
  }
  .color {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
`

export const ColorWrap = styled.div`
  padding: 16px;
  width: 192px;
`

export const ShareMemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  background: var(--neutral-n8);
  &:hover {
    background: var(--hover-d2);
  }
  .notCanOperation {
    font-size: 12px;
    color: var(--neutral-n3);
  }
  .canOperation {
    display: flex;
    align-items: center;
    color: var(--neutral-n1-d1);
    font-size: 12px;
    cursor: pointer;
    .icon {
      margin-left: 4px;
      font-size: 14px;
    }
    &:hover {
      color: var(--primary-d2);
    }
  }
`

export const PermissionDropBox = styled.div`
  border-radius: 6px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  background: var(--neutral-white-d6);
  position: relative;
`

export const PermissionDropItem = styled.div`
  padding: 5px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
  .sub {
    font-size: 12px;
    color: var(--neutral-n4);
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const MenuItem = styled.div`
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  color: var(--neutral-n2);
  font-size: 14px;
  cursor: pointer;
  background: var(--neutral-white-d6);
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`
