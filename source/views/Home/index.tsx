import { Link } from 'react-router-dom'
import { useModel } from '@/models'
import { useState } from 'react'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

const CountWrap = styled.div<{ marginTop: number }>(
  {
    [Button.toString()]: {
      color: '#f08',
      cursor: 'pointer',
    },
  },
  ({ marginTop }) => ({
    marginTop,
  }),
)

const Home = () => {
  const { user, getUser } = useModel('user')
  const [count, setCount] = useState(0)

  const onTap = () => {
    getUser()
  }

  const onAdd = () => {
    setCount(count + 1)
  }

  return (
    <div >
      首页
      <div>
        名称：{user?.name}；年龄：{user?.age}
      </div>
      <Button onClick={onTap}>获取用户信息</Button>
      <CountWrap marginTop={count}>
        计数：{count}
        <Button onClick={onAdd}>加数</Button>
      </CountWrap>
    </div>
  )
}

export default Home
