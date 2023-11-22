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
export const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 8px;
  > div:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: var(--font16);
    font-family: SiYuanMedium;
  }
  > div:nth-child(2) {
    display: flex;
    button {
      margin-left: 16px;
    }
  }
`
export const SubtitleWrap = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
  font-family: SiYuanMedium;
  position: relative;
  padding-left: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 16px;
  &::after {
    position: absolute;
    left: 0px;
    top: 4;
    width: 3px;
    height: 16px;
    background: var(--primary-d1);
    content: '';
  }
`
export const OtherDateBox = styled.div`
  display: flex;
  justify-content: space-between;
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
