/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Tree, type TreeProps } from 'antd'
import { useState } from 'react'

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
}

const WrapLeft = (props: Props) => {
  const x = 3
  const y = 2
  const z = 1
  const defaultData: any[] = []

  const generateData = (_level: number, _preKey?: React.Key, _tns?: any[]) => {
    const preKey = _preKey || '0'
    const tns = _tns || defaultData
    const children = []
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`
      tns.push({ title: key, key })
      if (i < y) {
        children.push(key)
      }
    }
    if (_level < 0) {
      return tns
    }
    const level = _level - 1
    children.forEach((key, index) => {
      tns[index].children = []
      return generateData(level, key, tns[index].children)
    })
  }
  generateData(z)
  const [gData, setGData] = useState(defaultData)
  const [expandedKeys, setExpandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0'])

  const onDragEnter: TreeProps['onDragEnter'] = (info: any) => {

    // console.log(info)
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  }

  const onDrop: TreeProps['onDrop'] = (info: any) => {

    // console.log(info)
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (
      data: any[],
      key: React.Key,
      callback: (node: any, i: number, data: any[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback)
        }
      }
    }
    const data = [...gData]
    let dragObj: any
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      loop(data, dropKey, item => {
        item.children = item.children || []
        item.children.unshift(dragObj)
      })
    } else if (
      ((info.node as any).props.children || []).length > 0
      && (info.node as any).props.expanded
      && dropPosition === 1
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || []
        item.children.unshift(dragObj)
      })
    } else {
      let ar: any[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!)
      } else {
        ar.splice(i! + 1, 0, dragObj!)
      }
    }
    setGData(data)
  }
  return (
    <Left isShowLeft={props.isShowLeft}>
      <TitleWrap>需求分类</TitleWrap>
      <Tree
        className="draggable-tree"
        defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
      />
    </Left>
  )
}

export default WrapLeft
