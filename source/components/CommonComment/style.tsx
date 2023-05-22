import styled from '@emotion/styled'

export const CommentFooter = styled.div<{ isReview?: boolean }>`
  width: 100%;
  height: auto;
  /* min-height: ${props => (props.isReview ? '280px' : '80px')}; */
  box-sizing: border-box;
  background: var(--neutral-white-d5);
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .buttonBox {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
`
