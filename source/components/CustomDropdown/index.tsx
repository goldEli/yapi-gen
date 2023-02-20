import { Dropdown, MenuProps } from 'antd'
import React from 'react'
import { StyleDropdown } from './style'

const index = (props: any) => {
  const items: any = [
    {
      key: 'edit',
      label: <span>编辑</span>,
    },
    {
      key: 'over',
      label: <span>结束</span>,
    },
    {
      key: 'del',
      label: <span>删除</span>,
    },
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    props.onChange(key)
  }
  return (
    <StyleDropdown
      trigger={['hover']}
      menu={{ items, onClick }}
      placement="bottomRight"
      getPopupContainer={(i: any) => i.parentNode}
    >
      {props.children}
    </StyleDropdown>
  )
}

export default index
