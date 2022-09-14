/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import { Input, Space, Table } from 'antd'
import ChooseColor from '../../components/ChooseColor'
import styled from '@emotion/styled'
import { useState } from 'react'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'

const TableTitle = styled.div({
  marginTop: 8,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  color: '#969799',
  fontSize: 12,
  fontWeight: 500,
  borderBottom: '1px solid #EBEDF0',
})

const AddWrapBox = styled.div({
  padding: '0 16px',
  height: 32,
  lineHeight: '32px',
  color: '#2877ff',
  width: 'fit-content',
  margin: '10px 0',
  cursor: 'pointer',
})

const TextWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
})

const ViewWrap = styled.div<{ color: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '20px',
    fontSize: 12,
    fontWeight: 400,
    width: 'fit-content',
    background: 'white',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

const data = [
  {
    key: '1',
    name: '实现中',
    color: '#43BA9A',
    remark: '说明文字内容说明文字内容说明文字内容说明文字内容说',
    endStatus: false,
    startStatus: true,
    index: 0,
    hasDemand: 3,
    hasCategory: [
      {
        name: '软件需求',
        color: '#43BA9A',
        isDisable: true,
        id: 1,
        hasDemand: 2,
      },
      {
        name: '开发需求',
        color: '#43BA9A',
        isDisable: true,
        id: 2,
        hasDemand: 2,
      },
    ],
  },
  {
    key: '2',
    name: '已结束',
    color: '#969799',
    remark: '说明文字',
    endStatus: true,
    startStatus: false,
    index: 1,
    hasDemand: 0,
    hasCategory: [
      {
        name: '软件需求',
        color: '#43BA9A',
        isDisable: true,
        id: 1,
        hasDemand: 2,
      },
    ],
  },
  {
    key: '3',
    name: '规划中',
    color: '#FA9746',
    remark: '说明文字内容说',
    endStatus: true,
    startStatus: false,
    index: 2,
    hasDemand: 3,
    hasCategory: [
      {
        name: '美术组',
        color: '#FA9746',
        isDisable: true,
        id: 1,
        hasDemand: 2,
      },
    ],
  },
]

interface Props {
  isVisible: boolean
  onUpdate(): void
  onClose(): void
}

const AddWrap = () => {
  return (
    <AddWrapBox>
      <IconFont style={{ fontSize: 16, marginRight: 8 }} type="plus" />
      <span style={{ fontSize: 14 }}>添加状态</span>
    </AddWrapBox>
  )
}

const AddActiveWrap = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
      <Input
        style={{ width: 196, marginRight: 16 }}
        placeholder="请输入状态名称"
        allowClear
      />
      <ChooseColor />
      <TextWrap style={{ margin: '0 16px 0 24px', color: '#2877ff' }}>
        完成
      </TextWrap>
      <TextWrap style={{ color: '#646566' }}>取消</TextWrap>
    </div>
  )
}

const AddWorkflow = (props: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [isAdd, setIsAdd] = useState(false)
  const onConfirm = () => {

    // console.log(form.getFieldsValue(), 'form.getFieldsValue()')
  }

  const onClose = () => {
    props?.onClose()
  }

  const columns = [
    {
      width: 252,
      title: '',
      dataIndex: 'name',
      render: (text: any, record: any) => <ViewWrap color={record?.color}>{text}</ViewWrap>
      ,
    },
    {
      width: 314,
      title: '',
      dataIndex: 'hasCategory',
      render: (text: any) => (
        <OmitText width={300}>
          {text.map((i: any) => i.name).join('、')}
        </OmitText>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <Space size={16}>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}

            // onClick={() => onClickOperation(record, 'edit')}
          >
            编辑
          </span>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}

            // onClick={() => onClickOperation(record, 'del')}
          >
            删除
          </span>
        </Space>
      ),
    },
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {

    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title="添加状态"
      onClose={onClose}
      onConfirm={onConfirm}
      width={784}
    >
      <TableTitle>
        <span style={{ width: '40%' }}>状态名称</span>
        <span style={{ width: '45%' }}>应用的需求类别</span>
        <span style={{ width: '15%' }}>操作</span>
      </TableTitle>
      {isAdd ? <AddActiveWrap /> : null}
      {!isAdd && (
        <div onClick={() => setIsAdd(true)}>
          <AddWrap />
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        showHeader={false}
        pagination={false}
        rowKey="index"
      />
    </CommonModal>
  )
}

export default AddWorkflow
