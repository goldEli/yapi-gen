/* eslint-disable react/no-unstable-nested-components */
import { useDispatch, useSelector } from '@store/index'
import { changeCreateVisible } from '@store/view'
import { Button, Divider, Dropdown, MenuProps, Space } from 'antd'
import React from 'react'
import CommonIconFont from '../CommonIconFont'
import { dropdowncontent, Name, SetLine, TextSpan, ViewPortWrap } from './style'

const ViewPort = () => {
  const dispatch = useDispatch()
  const items: MenuProps['items'] = [
    {
      key: '1',
      type: 'group',
      label: '个人视图',
      children: [
        {
          key: '1-1',
          label: <TextSpan>视图名称</TextSpan>,
        },
        {
          key: '1-2',
          label: <TextSpan>所有的</TextSpan>,
        },
      ],
    },
    {
      key: '2',
      type: 'group',
      label: '系统',
      children: [
        {
          key: '1-1',
          label: <TextSpan>所有的</TextSpan>,
        },
        {
          key: '1-2',
          label: <TextSpan>所有的</TextSpan>,
        },
      ],
    },
  ]
  const onClick: MenuProps['onClick'] = ({ key }) => {
    // console.log(key)
  }
  return (
    <Dropdown
      trigger={['click']}
      menu={{ items, onClick }}
      getPopupContainer={(node: any) => node.parentNode}
      dropdownRender={menu => (
        <div className={dropdowncontent}>
          {menu}
          <Divider style={{ margin: 0 }} />
          <SetLine onClick={() => dispatch(changeCreateVisible(true))}>
            <TextSpan>创建视图</TextSpan>
          </SetLine>
          <SetLine>
            <TextSpan>管理视图</TextSpan>
          </SetLine>
        </div>
      )}
    >
      <ViewPortWrap>
        <CommonIconFont size={18} type="view-n" />
        <Name>视图：最长视图名称哦哦哦哦哦哦哦哦哦哦哦哦哦哦 </Name>
      </ViewPortWrap>
    </Dropdown>
  )
}

export default ViewPort
