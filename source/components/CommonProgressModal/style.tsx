import styled from '@emotion/styled'

export const ProgressContentWrap = styled.div`
  padding: 0px 24px 24px 24px;
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
    margin-left: 104px;
    margin-right: 8px;
  }
  .username {
    font-family: SiYuanRegular;
  }
`
