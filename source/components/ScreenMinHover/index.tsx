import { Tooltip } from 'antd'
import IconFont from '../IconFont'
import { HoverWrap } from '../StyleCommon'

interface ScreenMinHoverProps {
  onClick?(): void
  isActive?: boolean
  icon: string
  label?: any
  children?: React.ReactNode
  style?: any
}

const ScreenMinHover = (props: ScreenMinHoverProps) => {
  // 最小宽度 -- 用于搜索栏按钮展示
  const screenMin: boolean = window.innerWidth <= 1440

  return (
    <HoverWrap
      onClick={props.onClick}
      isActive={props.isActive}
      style={props.style}
    >
      {screenMin && (
        <Tooltip
          title={props.label}
          getPopupContainer={n => n}
          trigger={['hover']}
        >
          <IconFont className="iconMain" type={props.icon} />
        </Tooltip>
      )}
      {!screenMin && (
        <>
          <IconFont className="iconMain" type={props.icon} />
          <span className="label">{props.children ?? props.label}</span>
        </>
      )}
    </HoverWrap>
  )
}

export default ScreenMinHover
