import styled from '@emotion/styled'

export const ExamineWrap = styled.div`
  background: var(--neutral-n8);
  width: 100%;
  padding: 8px 16px;
  border-radius: 6px;
  padding-top: 12px;
  min-width: 500px;
  display: flex;
  flex-direction: column;
`

export const TopWrap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .text {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 70%;
    .icon {
      font-size: 18px;
      margin-right: 8px;
      color: #fa9746;
      margin-top: 2px;
    }
    .sub {
      font-size: 14px;
      color: var(--neutral-n3);
      max-width: 85%;
    }
  }
  .cancel {
    font-size: 14px;
    color: var(--auxiliary-text-t1-d2);
    cursor: pointer;
  }
`
