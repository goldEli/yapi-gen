// 颜色选择组件
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Popover, Space } from 'antd'
import { useEffect, useState } from 'react'

const ChooseColorWrap = styled.div({
  width: 80,
  height: 80,
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '40px',
    height: '40px',
  },
})
const TextStyle = styled.span`
  width: 80px;
  text-align: center;
  line-height: 24px;
  border-radius: 0 0 6px 6px;
  display: inline-block;
  height: 24px;
  background-color: var(--neutral-n2);
  font-size: 12px;
  color: var(--neutral-white-d7);
  position: absolute;
  bottom: 0;
`
const ColorWrap = styled.div({
  width: '56px',
  height: '56px',
  borderRadius: '6px 6px 6px 6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: '1px solid var(--neutral-n6-d2)',
  position: 'relative',
  svg: {
    color: 'white',
  },
})
const ImgStyle = styled.img`
  width: 32px;
  height: 32px;
`
const IconFontStyle = styled(IconFont)({
  position: 'absolute',
  right: 0,
  top: 0,
  fontSize: 22,
})
interface ChooseColorProps {
  color?: any
  onChange?(value?: string): void
  onChangeValue?(value?: string): void
  colorList: any
}

const ChooseColor = (props: ChooseColorProps) => {
  const [isChooseColor, setIsChooseColor] = useState(false)

  const onChangeColor = (val: string) => {
    props?.onChangeValue?.(val)
    props?.onChange?.(val)
    setIsChooseColor(false)
  }
  const colorStatus = (
    <Space
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 16,
        flexWrap: 'wrap',
        maxWidth: 248,
      }}
      size={8}
    >
      {props.colorList?.map((i: any) => (
        <ColorWrap key={i.id} onClick={() => onChangeColor(i)}>
          <ImgStyle src={i.path} />
          <IconFontStyle hidden={i.path !== props?.color} type="anglemark" />
        </ColorWrap>
      ))}
    </Space>
  )

  const onVisibleChange = (visible: any) => {
    setIsChooseColor(visible)
  }
  return (
    <Popover
      visible={isChooseColor}
      placement="bottomLeft"
      trigger="click"
      content={colorStatus}
      onVisibleChange={onVisibleChange}
    >
      <ChooseColorWrap onClick={() => setIsChooseColor(true)}>
        <img src={props?.color} />
        <TextStyle>更换图标</TextStyle>
      </ChooseColorWrap>
    </Popover>
  )
}

export default ChooseColor
