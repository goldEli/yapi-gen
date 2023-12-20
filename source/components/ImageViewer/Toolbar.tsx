import React from 'react'
import styled from '@emotion/styled'
import { IconBox } from './styled'
import { Tooltip } from 'antd'
import IconFont from '../IconFont'

interface ToolBarProps {}

const ToolBarBox = styled.div`
  width: 293px;
  height: 56px;
  background: rgba(4, 4, 4, 0.6);
  border-radius: 12px 12px 12px 12px;
  position: absolute;
  left: calc(50% - 293px / 2);
  bottom: 32px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const Icon = styled(IconFont)`
  font-size: 24px;
  color: #ffffff;
`

const Text = styled.div`
  height: 22px;
  font-size: 14px;
  color: #969799;
  line-height: 22px;
`

const Split = styled.div`
  height: 16px;
  width: 1px;
  background: #969799;
`

const ToolBar: React.FC<ToolBarProps> = props => {
  return (
    <ToolBarBox>
      <IconBox
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Icon type="zoomin" />
      </IconBox>
      <Text>100%</Text>
      <IconBox
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Icon type="reduce" />
      </IconBox>
      <IconBox
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Icon type="rotate2" />
      </IconBox>
      <Split />
      <Tooltip title="下载图片">
        <IconBox
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <Icon type="download" />
        </IconBox>
      </Tooltip>
    </ToolBarBox>
  )
}

export default ToolBar
