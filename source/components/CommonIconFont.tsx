// 公共图标

import IconFont from './IconFont'

interface IconProps {
  type: string
  color?: string
  size?: number
  onClick?(): void
}

const CommonIconFont = (props: IconProps) => {
  return (
    <IconFont
      type={props.type}
      onClick={props?.onClick}
      style={{
        color: props.color,
        fontSize: props.size || 16,
      }}
    />
  )
}

export default CommonIconFont
