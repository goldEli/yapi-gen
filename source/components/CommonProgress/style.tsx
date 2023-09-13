import styled from '@emotion/styled'

export const ProgressContentWrap = styled.div`
  padding: 0px 24px 24px 24px;
  height: 70vh;
  overflow-y: scroll;
  .tips {
    font-size: 12px;
    color: var(--neutral-n3);
    margin-bottom: 12px;
  }
  .progressBox {
    font-family: SiYuanRegular;
    margin-bottom: 20px;
    .progress {
      display: flex;
      align-items: center;
      .slider {
        flex-grow: 9;
      }
      .inputNumber {
        flex-grow: 1;
      }
    }
  }
`

export const ShowProgress = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  margin-bottom: 24px;
  color: var(--neutral-n1-d1);
  .processor {
    margin-left: 38px;
    margin-right: 8px;
  }
`

export const CommonProgressWrap = styled.div`
  display: flex;
  align-items: center;
`
export const UpdateButton = styled.div`
  color: var(--auxiliary-text-t2-d2);
  padding: 5px 8px;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: var(--hover-d2);
  }
  &:active {
    background: var(--auxiliary-b6);
  }
`
export const ItemRow = styled.div`
  min-width: 240px;
  display: flex;
  align-items: center;
  cursor: pointer;
`
