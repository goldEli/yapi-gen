import { useThrottle } from '@/hooks/useThrottle'
import { AsyncButton } from '@staryuntech/ant-pro'

const ThrottleButton = (props: any) => {
  const tap = useThrottle(() => {
    props.thClick()
  }, 1000)

  return (
    <AsyncButton type="primary" onClick={tap}>
      {props.children}
    </AsyncButton>
  )
}

export default ThrottleButton
