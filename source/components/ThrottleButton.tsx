import { AsyncButton } from '@staryuntech/ant-pro'
import _ from 'lodash'

const ThrottleButton = (props: any) => {
  return (
    <AsyncButton
      type="primary"
      onClick={_.debounce(() => props.thClick(), 1000)}
    >
      {props.children}
    </AsyncButton>
  )
}

export default ThrottleButton
