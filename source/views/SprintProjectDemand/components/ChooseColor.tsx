// 颜色选择组件

import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Popover, Space } from 'antd'
import { useState } from 'react'

const ChooseColorWrap = styled.div<{ color?: string }>(
  {
    width: 80,
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
  },
  ({ color }) => ({
    background: color ? color : 'var(--neutral-n3)',
  }),
)

const ColorWrap = styled.div({
  height: 20,
  width: 20,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  svg: {
    color: 'white',
  },
})

interface ChooseColorProps {
  color?: any
  onChange?(value?: string): void
  onChangeValue?(value?: string): void
}

const ChooseColor = (props: ChooseColorProps) => {
  const [isChooseColor, setIsChooseColor] = useState(false)
  const { colorList } = useSelector(store => store.project)
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
        justifyContent: 'center',
      }}
      size={8}
    >
      {colorList.map((i: any) => (
        <ColorWrap
          key={i.key}
          style={{ background: i.key }}
          onClick={() => onChangeColor(i.key)}
        >
          <IconFont hidden={i.key !== props?.color} type="check" />
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
      <ChooseColorWrap
        color={props?.color}
        onClick={() => setIsChooseColor(true)}
      />
    </Popover>
  )
}

export default ChooseColor
