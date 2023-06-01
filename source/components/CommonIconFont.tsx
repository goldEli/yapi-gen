// 公共图标

import IconFont from './IconFont'

interface IconProps {
  type: any
  color?: string
  size?: number
  onClick?(e?: any): void
  onMouseLeave?(e?: any): void
  transform?: string
}

export const CommonIconFont = (props: IconProps) => {
  return (
    <IconFont
      type={props.type}
      onClick={e => props?.onClick?.(e)}
      onMouseLeave={e => props?.onMouseLeave?.(e)}
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
