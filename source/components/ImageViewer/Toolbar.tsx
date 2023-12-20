import React from 'react'
import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import IconFont from '../IconFont'
import { useImageViewerStore } from './useImageViewerStore'
import { downloadImage } from './utils'
import { useTranslation } from 'react-i18next'

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

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px 12px 12px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
  &:active {
    background: rgba(255, 255, 255, 0.36);
  }
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
  const { zoomIn, zoomOut, scale, onRotate, params } = useImageViewerStore()
  const [t] = useTranslation()
  return (
    <ToolBarBox
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <IconBox
        onClick={e => {
          e.stopPropagation()
          zoomIn()
        }}
      >
        <Icon type="zoomin" />
      </IconBox>
      <Text>{(scale * 100).toFixed(0)}%</Text>
      <IconBox
        onClick={e => {
          e.stopPropagation()
          zoomOut()
        }}
      >
        <Icon type="reduce" />
      </IconBox>
      <IconBox
        onClick={e => {
          e.stopPropagation()
          onRotate()
        }}
      >
        <Icon type="rotate2" />
      </IconBox>
      <Split />
      <Tooltip title={t('downloadImages')}>
        <IconBox
          onClick={e => {
            e.stopPropagation()
            if (!params) return
            downloadImage(params?.url ?? '', params?.name)
          }}
        >
          <Icon type="download" />
        </IconBox>
      </Tooltip>
    </ToolBarBox>
  )
}

export default ToolBar
