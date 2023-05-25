import CommonButton from '@/components/CommonButton'
import { InfoItem, InfoItemWrap, Label, SubLabel } from '../style'
import { useState } from 'react'
import StateTag from '@/components/StateTag'
import DragTable from '@/components/DragTable'
import CommonModal from '@/components/CommonModal'
import { Form, Select } from 'antd'
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'

const FormWrap = styled(Form)`
  padding: 0 24px;
  height: 160px;
`

const LinkSprint = () => {
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
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

  // 类型列表
  const typeList = [
    { label: '关联', value: 1 },
    { label: '前置', value: 2 },
    { label: '后置', value: 3 },
    { label: '阻塞', value: 4 },
    { label: '被阻塞', value: 5 },
    { label: '克隆', value: 6 },
  ]

  // 事务列表
  const sprintList = [
    { label: '事务1', value: 1 },
    { label: '事务2', value: 2 },
  ]

  // 关闭链接事务弹窗
  const onClose = () => {
    setIsVisible(false)
    form.resetFields()
  }

  // 提交链接事务表单
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    // 接口
  }

  return (
    <InfoItem>
      <CommonModal
        isVisible={isVisible}
        title="链接事务"
        onClose={onClose}
        confirmText="链接"
        onConfirm={onConfirm}
      >
        <FormWrap layout="vertical" form={form}>
          <Form.Item
            label="链接类型"
            name="type"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择类型"
              getPopupContainer={(node: any) => node}
              options={typeList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="事务"
            name="sprint"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder="请选择事务"
              getPopupContainer={(node: any) => node}
              options={sprintList}
              showArrow
              optionFilterProp="label"
              allowClear
            />
          </Form.Item>
        </FormWrap>
      </CommonModal>
      <Label>链接事务</Label>
      <InfoItemWrap>
        <CommonButton
          type="primaryText"
          icon="plus"
          onClick={() => setIsVisible(true)}
        >
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
