import styled from '@emotion/styled'
import { Menu } from 'antd'

export const Wrap = styled.div`
  flex: 0 0 auto;
`

export const Actions = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid #ecedef;
  padding: 8px 0px 8px 0;
  box-sizing: border-box;
  height: 46px;
  overflow: hidden;
`

export const Action = styled.div<{ isHidden?: boolean }>`
  order: ${props => (props.isHidden ? 9 : 0)};
  margin-bottom: 10px;
  visibility: visible;
  display: inline-flex;
  align-items: flex-start;
  margin: 0 0 10px 4px;
  font-size: 0;
  vertical-align: top;
`

export const MoreAction = styled.div`
  width: 0;
  order: 3;
  margin: 0 0 10px 0;
  position: absolute;
  right: 30px;
  top: 7px;
`

export const Buttons = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding-right: 20px;
  [data-action] {
    margin-left: 8px;
  }
  [data-more] {
    order: 10;
    width: 0;
    position: relative;
    left: 8px;
  }
  [data-hidden='true'] {
    order: 30;
  }
`

export const Separator = styled.div<{ isHidden?: boolean }>`
  order: ${props => (props.isHidden ? 9 : 0)};
  display: inline-block;
  height: 18px;
  width: 1px;
  border-left: 1px solid #666;
  margin: 0 0 10px 8px;
  + ${Action} {
    margin-left: 8px;
    color: #646566;
  }
`

export const Button = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  color: #646566;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  font-size: 20px;
  &:hover,
  &[data-active='true'] {
    background: #efefef;
  }
  &[data-no-background]:hover {
    background: none;
  }
`

export const ButtonText = styled.div`
  font-size: 14px;
  padding: 0 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90px;
  [data-options-arrow] {
    font-size: 12px;
  }
`

export const MoreButtons = styled.div`
  margin: -14px 0 4px;
  position: relative;
  top: 10px;
  vertical-align: top;
  [data-hidden='true'] {
    display: none;
  }
  ${Action} {
    margin: 0 0 4px 4px;
    &:first-child {
      margin: 0 0 4px 0;
    }
  }
  ${Separator} {
    display: block;
    width: 100%;
    height: 0;
    border-bottom: 1px solid #666;
    margin: 0 0 4px 0;
    + ${Action} {
      margin: 0 0 4px 0;
    }
  }
`

export const DropdownOverlay = styled(Menu)`
  background: #fff;
  .ant-dropdown-menu-item {
    &:hover {
      background: none;
    }
  }
`

export const EmojiList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 237px;
  gap: 4px;
  box-sizing: border-box;
`

export const EmojiItem = styled.div`
  font-size: 20px;
  width: 26px;
  height: 26px;
  line-height: 26px;
  cursor: pointer;
  user-select: none;
`

export const MixinButton = styled.div`
  display: flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 4px 0 0 4px;
  height: 100%;
  &:hover,
  &[data-active='true'] {
    background: #efefef;
  }
`

export const DropdownIconButton = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 12px;
  border-radius: 0 4px 4px 0;
  :hover,
  &.ant-dropdown-open {
    background: #e6f4ff;
  }
`
