/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Tree, type TreeProps } from 'antd'
import { useEffect, useState } from 'react'
import { getTreeList } from '@/services/project/tree'
import IconFont from '@/components/IconFont'
import { DataNode } from 'antd/lib/tree'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 300,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRight: '1px solid #EBEDF0',
    padding: '0px 16px 10px',
    background: 'white',
    height: 'calc(100vh - 64px)',
    '.ant-space-item': {
      display: 'flex',
    },
  },
  ({ isShowLeft }) => ({
    display: isShowLeft ? 'block' : 'none',
  }),
)

const TitleWrap = styled.div({
  fontSize: 14,
  color: '#646566',
  lineHeight: '52px',
})

interface Props {
  isShowLeft: boolean
  projectId: any
}
const TreeBox = styled.div`
  width: 220px;
  height: 40px;
  background: #f0f4fa;
  border-radius: 0px 0px 0px 0px;

  display: flex;
  align-items: center;
`
const TreeItem = (props: any) => {
  console.log(props, 'shjuju')

  return (
    <TreeBox>
      <span>{props.name}</span>
      <span>{props.num}</span>
      <IconFont type="more" />
    </TreeBox>
  )
}
const myData = [
  {
    title: '1-2',
    num: 1,
    key: '0-0',
    children: [
      {
        title: 1233,
        num: 1,
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            num: 1,
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            num: 1,
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        num: 1,
        key: '0-0-1',
        children: [
          {
            titleL: 'sss',
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
]
const filterTreeData = (data: any) => {
  const newData = data.map((item: any) => ({
    title: <TreeItem {...item} num={item.num} name={item.title} />,
    children:
      item.children && item.children.length
        ? filterTreeData(item.children)
        : null,
  }))
  return newData
}
const WrapLeft = (props: Props) => {
  const treeData: any = filterTreeData(myData)
  const init = async () => {
    const res = await getTreeList({ id: props.projectId })
    console.log(res)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Left isShowLeft={props.isShowLeft}>
      <TitleWrap>需求分类</TitleWrap>
      <Tree treeData={treeData} />
    </Left>
  )
}

export default WrapLeft
