import styled from '@emotion/styled'

export const EncephalogramBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  padding: 26px;
  box-sizing: border-box;
  .g6-component-tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
  }
`

export const MapContentBox = styled.div`
  canvas {
    cursor: pointer !important;
  }
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/mind/dotBg.png');
`
export const TopAreaBox = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`

export const ToolBarBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0px;
`
