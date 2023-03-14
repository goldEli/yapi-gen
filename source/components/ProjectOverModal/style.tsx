import styled from '@emotion/styled'

const Wrap = styled.div`
  padding: 0 24px;
  height: 500px;
  overflow-y: scroll;
  & .ant-form-item-label {
    /* display: none; */
    & ::after {
      content: '' !important;
    }
  }
`
const PinkWrap = styled.div`
  background: rgba(250, 151, 70, 0.1);
  border-radius: 6px 6px 6px 6px;
  padding: 12px 16px;

  margin-bottom: 24px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n2);
  line-height: 20px;
`

export { Wrap, PinkWrap }
