import styled from '@emotion/styled'
import { Table } from 'antd'

export const ProjectWarningWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px;
  width: 100%;
  height: 100%;
  overflow: auto;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .label {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
`

export const SubTitleBox = styled.div`
  position: relative;
  padding-left: 12px;
  display: flex;
  align-items: center;
  height: 22px;
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  font-family: SiYuanMedium;
  margin: 32px 0px 16px 0px;
  &::before {
    position: absolute;
    content: '';
    left: 0px;
    top: 2px;
    width: 3px;
    height: 16px;
    background: var(--primary-d1);
    display: flex;
    align-items: center;
  }
`
// 推送条件
export const PushConditionsWrap = styled.div`
  display: flex;
  flex-direction: column;
`

export const PushConditionsContent = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  min-height: 294px;
  border-radius: 6px;
  padding: 16px 8px;
`

export const TableWrap = styled(Table)`
  .ant-table-tbody > tr.ant-table-row:hover > td,
  .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: transparent !important;
  }
  .ant-table-row {
    height: inherit !important;
    color: var(--neutral-n1-d1);
    font-size: 14px;
  }
  .ant-table-tbody > tr > td {
    padding: 6px 16px;
  }
  .ant-table-thead > tr > th {
    height: 32px;
    border-bottom: none;
    font-size: 14px;
    color: var(--neutral-n3);
  }
`

export const TableItem = styled.div`
  display: flex;
  align-items: center;
  .input {
    margin: 0 8px;
    width: 72px;
    height: 32px;
  }
`

export const PushDateBox = styled.div``
export const PushDateContent = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  height: 102px;
  border-radius: 6px;
`
export const PreviewImageModalWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  top: 0;
  left: 0;
  .imgBox {
    align-self: flex-start;
    cursor: pointer;
    margin-left: 20px;
  }
`
export const BlueText = styled.span`
  cursor: pointer;
  color: var(--primary-d2);
`
export const GrayText = styled.span`
  cursor: pointer;
  color: var(--neutral-n3);
  font-size: 12px;
`

export const DingTalkGroupModalWrap = styled.div`
  padding: 0px 24px 24px 24px;
`
