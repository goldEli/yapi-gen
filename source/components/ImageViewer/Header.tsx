import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '../IconFont'
import { Tooltip } from 'antd'
import { useImageViewerStore } from './useImageViewerStore'
import { getImageInfo } from './utils'
import { closeImageViewer } from '.'

interface HeaderProps {}

const HeaderBox = styled.div`
  width: 100%;
  height: 64px;
  background: #1b1b1b;
  padding: 10px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
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

const Icon = styled(IconFont)`
  font-size: 28px;
  color: #ffffff;
`
const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px 6px 6px 6px;
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

const Header: React.FC<HeaderProps> = props => {
  const { params } = useImageViewerStore()
  const [imageInfo, setImageInfo] = useState<{
    w: number
    h: number
    size: number
  } | null>(null)
  const fileName = useMemo(() => {
    if (!params?.name) return '--'
    const arr = params?.name.split('.')
    const fileType = arr.pop()
    let name = arr.join('.')
    if (name.length > 24) {
      name = name.slice(0, 24) + '...'
    }
    return `${name}.${fileType}`
  }, [params?.name])

  useEffect(() => {
    if (params?.url) {
      getImageInfo(params?.url).then(res => {
        setImageInfo({
          w: res.width,
          h: res.height,
          size: res.size,
        })
      })
      return
    }
    setImageInfo(null)
  }, [params?.url])

  const size = useMemo(() => {
    if (!imageInfo?.w || !imageInfo?.h) return ''
    return `${imageInfo?.w}*${imageInfo?.h}`
  }, [imageInfo])

  const mSize = useMemo(() => {
    if (!imageInfo?.size) return ''
    return `${imageInfo?.size}M`
  }, [imageInfo])
  return (
    <HeaderBox
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <Left>
        <Title>{fileName}</Title>
        <Des>
          {size} {mSize}
        </Des>
      </Left>
      <Right>
        <Tooltip title="退出预览">
          <IconBox
            onClick={e => {
              e.stopPropagation()
              closeImageViewer()
            }}
          >
            <Icon type="close" />
          </IconBox>
        </Tooltip>
      </Right>
    </HeaderBox>
  )
}

export default Header
