// 公共图标

import IconFont from './IconFont'

interface IconProps {
  type: any
  color?: string
  size?: number
  onClick?(): void
  transform?: string
}

export const CommonIconFont = (props: IconProps) => {
  return (
    <IconFont
      type={props.type}
      onClick={props?.onClick}
      style={{
        color: props.color,
        fontSize: props.size || 16,
        transform: props?.transform,
      }}
      className="ant-select-suffix"
    />
  )
}

export default CommonIconFont
