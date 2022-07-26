/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
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
  Menu,
  message,
  Radio,
} from 'antd'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import moment from 'moment'

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

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
  height: 52,
  background: 'white',
  marginBottom: 8,
})

const IconWrap = styled(IconFont)({
  fontSize: 20,
  color: '#969799',
  cursor: 'pointer',
})

const SortItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 4,
    '&:hover': {
      color: '#2877ff',
      background: '#F0F4FA',
    },
  },
  ({ isActive }) => ({
    color: isActive ? '#2877ff' : '#646566',
    background: isActive ? '#F0F4FA' : 'white',
  }),
)

interface Props {
  isShowLeft: boolean
  onChangeVisible(): void
  onChangeOperation(item: any): void
}

const sortList = [
  { name: '创建时间升序', type: 'asc', key: 'created_at' },
  { name: '创建时间降序', type: 'desc', key: 'created_at' },
  { name: '开始时间升序', type: 'asc', key: 'start_at' },
  { name: '开始时间降序', type: 'desc', key: 'start_at' },
  { name: '结束时间升序', type: 'asc', key: 'end_at' },
  { name: '结束时间降序', type: 'desc', key: 'end_at' },
  { name: '标题升序', type: 'asc', key: 'name' },
  { name: '标题降序', type: 'desc', key: 'name' },
]

const WrapLeft = (props: Props) => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [currentSort, setCurrentSort] = useState(sortList[0])
  const [dataList, setDataList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const { getIterateList, updateIterateStatus, deleteIterate }
    = useModel('iterate')

  const getList = async () => {
    const values = form.getFieldsValue()
    if (values.startTime) {
      values.startTime = [
        moment(values.startTime[0]).format('YYYY-MM-DD'),
        moment(values.startTime[1]).format('YYYY-MM-DD'),
      ]
    }

    if (values.endTime) {
      values.endTime = [
        moment(values.endTime[0]).format('YYYY-MM-DD'),
        moment(values.endTime[1]).format('YYYY-MM-DD'),
      ]
    }

    const params = {
      projectId,
      order: currentSort.type,
      orderKey: currentSort.key,
      ...values,
    }
    const result = await getIterateList(params)
    setDataList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    getList()
  }, [currentSort])

  const options = [
    { label: '开启', value: 1 },
    { label: '结束', value: 2 },
  ]

  const onConfirmFilter = () => {
    getList()
  }

  const onReset = () => {
    form.resetFields()
  }

  const onClose = () => {
    form.resetFields()
    setIsFilter(false)
  }

  const sortContent = (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 132 }}>
      {sortList.map(i => (
        <SortItem
          isActive={currentSort.name === i.name}
          key={i.type}
          onClick={() => setCurrentSort(i)}
        >
          {i.name}
        </SortItem>
      ))}
    </div>
  )

  const filterContent = (
    <div className="filterContent">
      <Form form={form} style={{ width: 260, padding: 24 }} layout="vertical">
        <Form.Item label="标题" name="name">
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group options={options} defaultValue={1} />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div onClick={onReset}>清空</div>
          <Space size={16}>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={onConfirmFilter}>
              过滤
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  )

  const onChangeEdit = (item: any) => {
    props.onChangeOperation(item)
    props.onChangeVisible()
  }

  const onChangeEnd = async (item: any) => {
    try {
      await updateIterateStatus({
        projectId,
        id: item.id,
        status: item.status !== 1,
      })
      message.success('更改状态成功')
      getList()
    } catch (error) {

      //
    }
  }

  const onChangeDelete = (item: any) => {
    setIsDeleteId(item.id)
    setIsVisible(true)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteIterate({
        projectId,
        id: isDeleteId,
      })
      setIsVisible(false)
      message.success('删除成功')
      getList()
    } catch (error) {

      //
    }
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => onChangeEdit(item)}>编辑</div>,
        },
        {
          key: '2',
          label: (
            <div onClick={() => onChangeEnd(item)}>
              {item.status === 1 ? '关闭' : '开启'}
            </div>
          ),
        },
        {
          key: '3',
          label: <div onClick={() => onChangeDelete(item)}> 删除 </div>,
        },
      ]}
    />
  )

  const onClickItem = (item: any) => {
    navigate(`/Detail/Iteration?type=info&id=${projectId}&iterateId=${item.id}`)
  }

  return (
    <Left isShowLeft={props.isShowLeft}>
      <DeleteConfirm
        text="确认要删除当前迭代版本？"
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <TopWrap>
        <AddButton text="创建迭代" onChangeClick={props.onChangeVisible} />
        <Space size={20}>
          <Popover
            trigger="click"
            placement="bottom"
            content={sortContent}
            getPopupContainer={node => node}
          >
            <IconWrap type="sort" />
          </Popover>
          <Divider style={{ margin: 0, height: 20 }} type="vertical" />
          <Popover
            trigger="click"
            placement="bottomRight"
            content={filterContent}
            getPopupContainer={node => node}
            visible={isFilter}
          >
            <IconWrap onClick={() => setIsFilter(true)} type="filter" />
          </Popover>
        </Space>
      </TopWrap>
      {dataList.list?.map((item: any) => (
        <IterationCard
          menu={menu(item)}
          key={item.id}
          item={item}
          onClickItem={() => onClickItem(item)}
        />
      ))}
    </Left>
  )
}

export default WrapLeft
