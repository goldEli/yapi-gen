import { Dropdown } from 'antd'
import React from 'react'

const index = (props: any) => {
  const items: any = [
    {
      key: '1',
      label: <span>编辑</span>,
    },
    {
      key: '2',
      label: <span>结束</span>,
    },
    {
      key: '3',
      label: <span>删除</span>,
    },
  ]
  return (
    <Dropdown trigger={['click']} menu={{ items }} placement="bottomRight">
      {props.children}
    </Dropdown>
  )
}

export default index
