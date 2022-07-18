import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Button } from 'antd'

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #282c34;
`
const Dialog = styled.div`
  width: 500px;
  height: 500px;
  background-color: white;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`
export default function Next(props: { visible: boolean; close(): void }) {
  const [active, setActive] = useState(0)
  const inform = [
    {
      text: 'IFUN敏捷系统将同步OA企业信息员工成员',
    },
    {
      text: '请到设置-权限管理配置权限组系统提供了管理员、编辑者、参与者三个系统权限组还可自定义更多权限组',
    },
    {
      text: '请在员工管理中配置用户权限',
    },
    {
      text: '创建项目，开始项目管理',
    },
  ]
  const filterData = useMemo(() => {
    const filterActive = inform.filter((item, index) => index === active)
    return filterActive.map(item => (
      <div>
        <p>{item.text}</p>
        <img src="" alt="12"></img>
      </div>
    ))
  }, [active])

  const next = () => {
    let index = active
    index++
    setActive(index)
  }

  const prev = () => {
    let index = active
    index--
    setActive(index)
  }
  if (!props.visible) {
    return null
  }
  return (
    <Container>
      <Dialog>
        <header>头</header>
        <div>{filterData}</div>
        <footer>
          {active === inform.length - 1 && (
            <Button onClick={() => props.close()} type="primary">
              完成
            </Button>
          )}
          {active !== inform.length - 1 && (
            <Button onClick={next}>下一步</Button>
          )}
          {active !== 0 && <Button onClick={prev}>上一步</Button>}
        </footer>
      </Dialog>
    </Container>
  )
}
