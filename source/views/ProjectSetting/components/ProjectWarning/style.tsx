import styled from '@emotion/styled'
import { Table } from 'antd'
export const SwitchLabel = styled.div`
  min-width: 60px;
  color: var(--neutral-n2);
`
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
  position: sticky;
  top: 0px;
  z-index: 9;
  background: #fff;
  padding: 16px 0 8px 0;
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
  min-height: 242px;
  border-radius: 6px;
  padding: 16px 8px 0;
`
export const PushChannelContent = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  padding: 16px 8px 0;
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
    padding: 8px 16px;
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
// 预警卡片
export const WaringCardWrap = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  width: 100%;
  margin-top: 16px;
`

export const WaringCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--neutral-n8);
  padding: 16px 24px;
`

export const WaringCardHeaderLeft = styled.div`
  display: flex;
  width: calc(100% - 64px);
  .title {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
  .sub {
    margin-left: 12px;
    font-size: 12px;
    color: var(--neutral-n3);
  }
`

export const WaringCardContent = styled.div`
  padding: 24px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`

export const WaringCardItem = styled.div`
  display: flex;
  flex-direction: column;
  .label {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .content {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    margin-top: 4px;
    display: flex;
    flex-direction: column;
  }
`

export const WaringGoto = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--primary-d1);
  position: absolute;
  right: 24px;
  gap: 8px;
  cursor: pointer;
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
    display: flex;
    cursor: pointer;
    align-items: flex-start;
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
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const DingTalkGroupModalWrap = styled.div`
  padding: 0px 24px 24px 24px;
`
