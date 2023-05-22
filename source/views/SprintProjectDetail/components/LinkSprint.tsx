import CommonButton from '@/components/CommonButton'
import { InfoItem, InfoItemWrap, Label, SubLabel } from '../style'
import { useState } from 'react'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'

const LinkSprint = () => {
  const [dataSource, setDataSource] = useState<any>({
    list: [
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 0,
      },
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 1,
      },
      {
        number: 'DXKJ-DDD',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 2,
      },
    ],
  })

  const [dataSource1, setDataSource1] = useState<any>({
    list: [
      {
        number: 'DXKJ-DDD2',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 0,
      },
      {
        number: 'DXKJ-DDD3',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 1,
      },
      {
        number: 'DXKJ-DDD4',
        name: '事务名称',
        priority: '优先级',
        dealName: '处理人',
        index: 2,
      },
    ],
  })

  const columns = [
    {
      title: '',
      dataIndex: 'number',
      render: (text: any, record: any) => <div>{text}</div>,
    },
    {
      title: '',
      dataIndex: 'name',
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: '',
      dataIndex: 'priority',
      render: (text: any, record: any) => <div>{text}</div>,
    },
    {
      title: '',
      dataIndex: 'dealName',
      render: (text: any, record: any) => <div>{text}</div>,
    },
    {
      title: '',
      dataIndex: 'status',
      render: (text: string, record: any) => (
        <StateTag name="进行中" state={1} />
      ),
    },
  ]

  return (
    <InfoItem>
      <Label>链接事务</Label>
      <InfoItemWrap>
        <CommonButton type="primaryText" icon="plus">
          创建链接的事务
        </CommonButton>
        <SubLabel>关联</SubLabel>
        <DragTable
          columns={columns}
          dataSource={dataSource}
          onChangeData={setDataSource}
        />
        <SubLabel>前置</SubLabel>
        <DragTable
          columns={columns}
          dataSource={dataSource1}
          onChangeData={setDataSource1}
        />
      </InfoItemWrap>
    </InfoItem>
  )
}

export default LinkSprint
