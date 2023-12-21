import styled from '@emotion/styled'
import Icon from '../../assets/icons'

export const ToolTable = styled.div`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  width: 200px;

  /* td {
    width: 16px;
    height: 16px;
    font-size: 12px;
    font-weight: bold;
  } */
`

export const HightLightTd = styled.div<{ bright?: string }>`
  list-style: none;
  border: 2px solid white;
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
  box-sizing: border-box;
  background-color: ${({ bright }) => bright ?? 'blue'};
  border-radius: 1px;
`

export const HightLightSpan = styled.div<{ bright?: string }>`
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border: 2px solid #f2f3f7;
  vertical-align: sub;
  border-radius: 1px;
  box-sizing: border-box;
  background-color: ${({ bright }) => bright ?? 'blue'};
`

export const BrightIcon = styled(Icon)`
  position: absolute;
  color: white;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
`

export const BrightIconGrep = styled(Icon)`
  position: absolute;
  color: #dddee1;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
`

export const MoreButton = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  margin-top: 16px;
  border-top: 1px solid #f2f3f7;
  span {
    font-weight: bold;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
  }
`

export const ColorPanel = styled.img`
  margin-right: 6px;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  /* background: url(""); */
`

export const ColorChooseInput = styled.input`
  position: absolute;
  top: -40px;
  right: -70px;
  opacity: 0;
`
