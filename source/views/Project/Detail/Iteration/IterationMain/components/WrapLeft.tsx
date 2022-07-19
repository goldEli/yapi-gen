import AddButton from '@/components/AddButton'
import IterationCard from '@/components/IterationCard'
import IconFont from '@/components/IconFont'
import {
  Space,
  Divider,
  Popover,
  Form,
  Input,
  DatePicker,
  Checkbox,
} from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

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
  cursor: 'pointer',
})

const SortItem = styled.div({
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#646566',
  fontSize: 14,
  cursor: 'pointer',
  marginTop: 4,
  '&:hover': {
    color: '#2877ff',
    background: '#F0F4FA',
  },
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

const sortList = [
  { name: '创建时间升序', type: 'createTimeUp' },
  { name: '创建时间降序', type: 'createTimeDown' },
  { name: '开始时间升序', type: 'startTimeUp' },
  { name: '开始时间降序', type: 'startTimeDown' },
  { name: '结束时间升序', type: 'endTimeUp' },
  { name: '结束时间降序', type: 'endTimeDown' },
  { name: '标题升序', type: 'titleUp' },
  { name: '标题降序', type: 'titleDown' },
]

export default (props: Props) => {
  const [from] = Form.useForm()
  const options = [
    { label: '开始', value: 'Apple' },
    { label: '结束', value: 'Pear' },
  ]
  const sortContent = (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 132 }}>
      {sortList.map(i => (
        <SortItem key={i.type}>{i.name}</SortItem>
      ))}
    </div>
  )
  const filterContent = (
    <div className="filterContent">
      <Form form={from} style={{ width: 260, padding: 24 }} layout="vertical">
        <Form.Item label="标题">
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="开始时间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="结束时间">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="状态">
          <Checkbox.Group options={options} defaultValue={['Apple']} />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>清空</div>
          <Space size={16}>
            <Button>取消</Button>
            <Button type="primary">过滤</Button>
          </Space>
        </div>
      </Form>
    </div>
  )
  return (
    <Left isShowLeft={props.isShowLeft}>
      <TopWrap>
        <AddButton text="创建迭代" />
        <Space size={20}>
          <Popover
            placement="bottom"
            content={sortContent}
            getPopupContainer={node => node}
          >
            <IconWrap type="sort" />
          </Popover>
          <Divider style={{ margin: 0, height: 20 }} type="vertical" />
          <Popover
            placement="bottomRight"
            content={filterContent}
            getPopupContainer={node => node}
          >
            <IconWrap type="filter" />
          </Popover>
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
