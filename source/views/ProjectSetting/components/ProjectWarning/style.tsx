import styled from '@emotion/styled'

export const ProjectWarningWrap = styled.div`
  display: flex;
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
    align-self: flex-start;
    cursor: pointer;
    margin-left: 20px;
  }
`
