import AddButton from '@/components/AddButton'
import IterationCard from '@/components/IterationCard'
import IconFont from '@/components/IconFont'
import { Space, Divider } from 'antd'
import styled from '@emotion/styled'

const Left = styled.div<{ isShowLeft: boolean }>(
  {
    width: 300,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    borderRight: '1px solid #EBEDF0',
    padding: '0px 16px 10px',
    background: 'white',
    zIndex: 1,
    '.ant-space-item': {
      display: 'flex',
    },
  },
  ({ isShowLeft }) => ({
    display: isShowLeft ? 'block' : 'none',
  }),
)

const TopWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 64,
  zIndex: 2,
  height: 52,
  background: 'white',
  marginBottom: 8,
})

const IconWrap = styled(IconFont)({
  fontSize: 20,
  color: '#969799',
})

const list = [
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
  {
    name: '敏捷版本v1.0',
    process: 75,
    time: '2022.06.17-2022.07.30',
    status: 0,
  },
]

interface Props {
  isShowLeft: boolean
}

export default (props: Props) => {
  return (
    <Left isShowLeft={props.isShowLeft}>
      <TopWrap>
        <AddButton text="创建迭代" />
        <Space size={20}>
          <IconWrap type="sort" />
          <Divider style={{ margin: 0, height: 20 }} type="vertical" />
          <IconWrap type="filter" />
        </Space>
      </TopWrap>
      {list.map((item, index) => (
        <IterationCard
          key={`${item.name}_${index}`}
          item={item}
        ></IterationCard>
      ))}
    </Left>
  )
}
