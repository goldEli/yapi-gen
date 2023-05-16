import styled from '@emotion/styled'

export const Wrap = styled.div<{ bb: boolean; type: boolean }>`
  width: ${props => (props.bb ? '476px' : '460px')};
  height: ${props => (props.bb ? '542px' : '500px')};
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;

  box-sizing: border-box;
  padding: 24px;
  position: relative;
  border-top: 2px solid ${props => (props.type ? '#7773fe' : 'transparent')};
  img {
    -webkit-user-drag: none;
  }
`
export const MyBtn = styled.div<{ type: boolean }>`
  width: 128px;
  height: 40px;
  background-image: ${props =>
    props.type
      ? 'linear-gradient(225deg, #8db1f6 0%, #7266ff 100%)'
      : 'linear-gradient(225deg, #8DD2F6 0%, #6688FF 100%)'};
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  right: 24px;
  bottom: 24px;
  box-sizing: border-box;
  padding: 9px 24px;
  color: var(--auxiliary-text-t1-d1);
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: all 1s;
`
