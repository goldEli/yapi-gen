import { getTicket } from '@/services/user'

const Demo = () => {

  // console.log(localStorage.getItem('token'))

  return <div onClick={() => getTicket()}>去登录</div>
}

export default Demo
