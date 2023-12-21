import styled from '@emotion/styled'
import loadingImage from '../assets/loading.gif'

export const Wrap = styled.div`
  margin-top: 10px;
  z-index: auto;
  /* position: relative; */
  display: flex;
  flex-direction: column;

  overflow: auto;

  height: 150px;
`

export const Item = styled.div`
  user-select: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  padding: 5px 8px;
  &[data-active='true'] {
    background: #e6f4ff;
    color: #1677ff;
  }
  &:hover {
    background: #e6f4ff;
    color: #1677ff;
  }
`

export const Loading = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  background: url(${loadingImage}) top / 30px no-repeat;
  backdrop-filter: blur(1px);
`

export const Empty = styled.div`
  font-size: 14px;
  color: #ccc;
  line-height: 20px;
  padding: 5px 8px;
`
