import React from 'react'
import styled from '@emotion/styled'
import IconFont from '../IconFont'
import { useImageViewerStore } from '.'
import { Tooltip } from 'antd'
import { Icon, IconBox } from './styled'

interface HeaderProps {}

const HeaderBox = styled.div`
  width: 100%;
  height: 64px;
  background: #1b1b1b;
  padding: 10px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`
const Title = styled.div`
  height: 24px;
  font-size: 16px;
  color: #ffffff;
  line-height: 24px;
  font-family: SiYuanMedium;
`

const Des = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: SiYuanMedium;
  color: #969799;
  line-height: 20px;
`
const Left = styled.div`
  display: flex;
  flex-direction: column;
`
const Right = styled.div`
  display: flex;
  align-items: center;
`

const Header: React.FC<HeaderProps> = props => {
  const { setOpen } = useImageViewerStore()
  return (
    <HeaderBox>
      <Left>
        <Title>{'这是图片文件这是最长名称XXXXXXXXXXXXX....jpg'}</Title>
        <Des>{'3600*1232 28M'}</Des>
      </Left>
      <Right>
        <Tooltip title="退出预览">
          <IconBox onClick={() => setOpen(false)}>
            <Icon type="close" />
          </IconBox>
        </Tooltip>
      </Right>
    </HeaderBox>
  )
}

export default Header
