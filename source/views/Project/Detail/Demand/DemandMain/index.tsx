import Operation from './components/Operation'
import DemandTable from './components/DemandTable'
import DemandGrid from './components/DemandGrid'
import { Menu } from 'antd'
import { useState } from 'react'

const list = [
  {
    id: '121212',
    name: '需求标题名称',
    demand: 8,
    iteration: '敏捷版本V1.0',
    priority: 0,
    dealName: '何飞',
    status: '进行中',
    createTime: '2022-02-32',
    endTime: '200-03-12',
    startTime: '200-03-12',
  },
  {
    id: '121212',
    name: '需求标题名称',
    demand: 8,
    iteration: '敏捷版本V1.0',
    priority: 2,
    dealName: '何飞',
    status: '进行中',
    createTime: '2022-02-32',
    endTime: '200-03-12',
    startTime: '200-03-12',
  },
]

interface Props {
  onChangeVisible(e: any): void
}

const DemandMain = (props: Props) => {
  const [isGrid, setIsGrid] = useState(true)

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={e => props.onChangeVisible(e)}>编辑</div>,
        },
        {
          key: '2',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  return (
    <div>
      <Operation
        isGrid={isGrid}
        onChangeGrid={setIsGrid}
        onChangeVisible={(e: any) => props.onChangeVisible(e)}
      />
      {isGrid
        ? <DemandGrid menu={menu} />
        : <DemandTable menu={menu} List={list} />
      }
    </div>
  )
}

export default DemandMain
