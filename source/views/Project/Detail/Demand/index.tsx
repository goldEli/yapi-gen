import { Menu } from 'antd'
import Operation from './components/Operation'
import DemandTable from './components/DemandTable'
import DemandGrid from './components/DemandGrid'
import { useState } from 'react'

const List = [
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
    priority: 0,
    dealName: '何飞',
    status: '进行中',
    createTime: '2022-02-32',
    endTime: '200-03-12',
    startTime: '200-03-12',
  },
]

export default () => {
  const [isGrid, setIsGrid] = useState(true)
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div>编辑</div>,
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
      <Operation isGrid={isGrid} onChangeGrid={setIsGrid} />
      {isGrid ? (
        <DemandGrid menu={menu} />
      ) : (
        <DemandTable menu={menu} List={List} />
      )}
    </div>
  )
}
