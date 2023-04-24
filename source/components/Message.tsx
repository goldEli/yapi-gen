/* eslint-disable consistent-return */
import { message } from 'antd'
import CommonIconFont from './CommonIconFont'

interface Props {
  msg: string
  type: string
}

const getMsgType = (type: string, msg: string) => {
  switch (type) {
    case 'success':
      return message.success({
        icon: (
          <CommonIconFont type="check-91i0o6ja" color="#43ba9a" size={16} />
        ),
        content: <span style={{ color: '#323233', fontSize: 14 }}>{msg}</span>,
      })
    case 'warning':
      return message.warning({
        icon: <CommonIconFont type="fillwarning" color="#FA9746" size={16} />,
        content: <span style={{ color: '#323233', fontSize: 14 }}>{msg}</span>,
      })
    case 'error':
      return message.error({
        icon: (
          <CommonIconFont type="close-circle-fill" color="#FF5C5E" size={16} />
        ),
        content: <span style={{ color: '#323233', fontSize: 14 }}>{msg}</span>,
      })
  }
}
export const getMessage = (props: Props) => {
  return getMsgType(props.type, props.msg)
}
