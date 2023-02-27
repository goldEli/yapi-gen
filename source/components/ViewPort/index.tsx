/* eslint-disable react/no-unstable-nested-components */
import { useDispatch, useSelector } from '@store/index'
import { changeCreateVisible, changeViewVisible } from '@store/view'
import { getViewList } from '@store/view/thunk'
import { Button, Divider, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect } from 'react'
import CommonIconFont from '../CommonIconFont'
import { dropdowncontent, Name, SetLine, TextSpan, ViewPortWrap } from './style'

const ViewPort = (props: any) => {
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
  useEffect(() => {
    dispatch(getViewList(props.pid))
  }, [])

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
          <SetLine onClick={() => dispatch(changeViewVisible(true))}>
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
