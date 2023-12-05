import { StatusWrap } from './StyleCommon'
import { Tooltip } from 'antd'
const StateTag = (props: any) => {
  console.log('-----', props)
  const { state, name, categoryName } = props
  return (
    <StatusWrap
      onClick={props.onClick}
      isShow={props.isShow}
      state={props.state}
    >
      <Tooltip title={categoryName}>{name}</Tooltip>
    </StatusWrap>
  )
}

export default StateTag
