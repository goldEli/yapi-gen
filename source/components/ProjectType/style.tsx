import styled from '@emotion/styled'

export const Wrap = styled.div<{ bb: boolean }>`
  width: ${props => (props.bb ? '476px' : '460px')};
  height: ${props => (props.bb ? '542px' : '500px')};
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid #ecedef;
  box-sizing: border-box;
  padding: 24px;
  img {
    -webkit-user-drag: none;
  }
`
