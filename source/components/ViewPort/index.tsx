/* eslint-disable react/no-unstable-nested-components */
import { useDispatch, useSelector } from '@store/index'
import {
  changeCreateVisible,
  changeViewVisible,
  saveScreen,
  saveTitles,
} from '@store/view'
import { getViewList } from '@store/view/thunk'
import { Button, Divider, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import CommonIconFont from '../CommonIconFont'
import { dropdowncontent, Name, SetLine, TextSpan, ViewPortWrap } from './style'

const ViewPort = (props: any) => {
  const dispatch = useDispatch()
  const { viewList } = useSelector(state => state.view)

  const items: any = [
    {
      key: '1',
      type: 'group',
      label: '个人视图',
      children: viewList
        ?.filter((i: any) => {
          return i.type !== 2
        })
        .map((item: any) => {
          return {
            key: item.id,
            label: <TextSpan>{item.name}</TextSpan>,
          }
        }),
    },
    {
      key: '2',
      type: 'group',
      label: '系统',
      children: viewList
        ?.filter((i: any) => {
          return i.type === 2
        })
        .map((item: any) => {
          return {
            key: item.id,
            label: <TextSpan>{item.name}</TextSpan>,
          }
        }),
    },
  ]

  const onClick = (e: any) => {
    const value =
      viewList[viewList.findIndex((i: any) => String(i.id) === e.key)]

    dispatch(saveTitles(value.config.fields))
    dispatch(saveScreen({ key: [], value: [], choose: value.config.search }))
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
