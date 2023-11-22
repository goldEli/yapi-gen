import styled from '@emotion/styled'

export const WorkTimeWrap = styled.div`
  padding: 8px 22px 0px 22px;
  max-height: calc(90vh - 136px);
  min-height: 484px;
  overflow: scroll;
  .group {
    margin-top: 8px;
    margin-bottom: 32px;
  }
  .timeBox {
    margin-bottom: 32px;
    .total {
      font-size: 14px;
      font-family: SiYuanMedium;
      color: var(--neutral-n1-d1);
      display: inline-block;
      margin-bottom: 8px;
    }
    .timeList {
      display: flex;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 200px;
        padding: 8px 0px 0px 0px;
        margin-right: 40px;
      }
    }
  }
  .tableBox {
    .title {
      font-size: 14px;
      font-family: SiYuanMedium;
      color: var(--neutral-n1-d1);
      margin-bottom: 8px;
    }
  }
`

export const OperationBox = styled.div`
  font-size: 14px;
  color: var(--primary-d2);
  display: flex;
  justify-content: center;
  cursor: pointer;
`

export const DisableButton = styled.div<{ disabled: boolean }>`
  color: ${(props: any) => (props.disabled ? 'var(--auxiliary-t4)' : 'none')};
  & > span {
    margin-right: 16px;
  }
`
export const TableBox = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  margin-top: 8px;
  border-radius: 5px;
  padding: 0px 5px 0px 0px;
  .ant-table-thead > tr > th {
    border-bottom: none;
  }
`
