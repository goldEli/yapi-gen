import Operation from './components/Operation'
import IterationTable from './components/IterationTable'
import IterationGrid from './components/IterationGrid'
import WrapLeft from './components/WrapLeft'
import { Menu } from 'antd'
import { useState } from 'react'
import styled from '@emotion/styled'

const List = [
  {
    id: '121212',
    name: '需求标题名称',
    demand: 8,
    iteration: '敏捷版本V1.0',
    priority: 0,
    dealName: '何飞',
    status: 0,
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
    status: 0,
    createTime: '2022-02-32',
    endTime: '200-03-12',
    startTime: '200-03-12',
  },
]

const Right = styled.div<{ isShowLeft: boolean }>({}, ({ isShowLeft }) => ({
  width: isShowLeft ? 'calc(100% - 300px)' : '100%',
}))

interface Props {
  onChangeVisible(): void
}

export default (props: Props) => {
  const [isGrid, setIsGrid] = useState(true)
  const [isShowLeft, setIsShowLeft] = useState(true)
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={props.onChangeVisible}>编辑</div>,
        },
        {
          key: '2',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  return (
    <div style={{ display: 'flex' }}>
      <WrapLeft
        isShowLeft={isShowLeft}
        onChangeVisible={props.onChangeVisible}
      />
      <Right isShowLeft={isShowLeft}>
        <Operation
          isGrid={isGrid}
          onChangeGrid={setIsGrid}
          onChangeVisible={props.onChangeVisible}
          onChangeIsShowLeft={() => setIsShowLeft(!isShowLeft)}
        />
        {isGrid ? (
          <IterationGrid menu={menu} />
        ) : (
          <IterationTable menu={menu} List={List} />
        )}
      </Right>
    </div>
  )
}
