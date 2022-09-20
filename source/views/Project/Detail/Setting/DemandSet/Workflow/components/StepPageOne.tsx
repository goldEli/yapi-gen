/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Form, Radio, Select, Space, Switch, Table, Tooltip } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useState } from 'react'
import { OmitText } from '@star-yun/ui'
import EditWorkflow from './EditWorkflow'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import AddWorkflow from './AddWorkflow'
import { useModel } from '@/models'
import { CategoryWrap, ViewWrap } from '@/components/StyleCommon'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'

const TableWrap = styled.div({
  width: '100%',
  maxHeight: 'calc(100% - 262px)',
  overflowY: 'auto',
})

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const HasDemandText = styled.div({
  marginTop: 8,
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

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
  },
]

const categoryList = [
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
]

const StepPageOne = () => {
  const { colorList } = useModel('project')
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState(data)

  const onClickOperation = (row: any, type: string) => {
    setOperationObj(row)
    if (type === 'edit') {
      setIsVisible(true)
    } else {
      Number(row.hasDemand) ? setIsHasDelete(true) : setIsDelVisible(true)
    }
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
  }

  const onConfirmHasDelete = async () => {

    // 历史迁移确认
  }

  const onDeleteConfirm = () => {

    // 删除确认
  }

  const onConfirm = (formData: any) => {

    // 编辑确认
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const onUpdate = () => {

    // 更新列表
  }

  const DragHandle = sortableHandle(() => <IconFont type="move" />)

  const SortableItem = sortableElement(
    (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  )
  const SortableBody = sortableContainer(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />
    ,
  )

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      setDataSource(newData)
    }
  }

  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    const index = dataSource.findIndex(
      x => x.index === restProps['data-row-key'],
    )
    return <SortableItem index={index} {...restProps} />
  }

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      render: () => <DragHandle />,
    },
    {
      title: '状态名称',
      width: 140,
      dataIndex: 'name',
      render: (text: any, record: any) => <ViewWrap color={record?.color}>{text}</ViewWrap>
      ,
    },
    {
      title: '状态说明',
      width: 400,
      dataIndex: 'remark',
      render: (text: any) => <OmitText width={380}>{text}</OmitText>,
    },
    {
      width: 120,
      title: (
        <div>
          <span>起始状态</span>
          <Tooltip title="创建需求的默认状态">
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'startStatus',
      render: (text: any) => <Radio defaultChecked={text} />,
    },
    {
      width: 120,
      title: (
        <div>
          <span>结束状态</span>
          <Tooltip title="需求的终结状态，流转至当前状态，需求标题会灰色展示！">
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'endStatus',
      render: (text: any) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={text}
        />
      ),
    },
    {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <Space size={16}>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'edit')}
          >
            编辑
          </span>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'del')}
          >
            删除
          </span>
        </Space>
      ),
    },
  ]

  return (
    <>
      <AddWorkflow
        isVisible={isAddVisible}
        onUpdate={onUpdate}
        onClose={() => setIsAddVisible(false)}
      />
      <EditWorkflow
        category={categoryList}
        item={operationObj}
        isVisible={isVisible}
        onClose={onClose}
        onConfirm={onConfirm}
      />
      <DeleteConfirm
        text="确认删除需求状态？"
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title="历史数据迁移"
          onConfirm={onConfirmHasDelete}
        >
          <HasDemandText>{`共有${operationObj?.hasDemand}个需求当前处于【${operationObj?.name}】，删除状态后您需要为这些需求分配一个新的状态`}</HasDemandText>
          <FormWrap form={form} layout="vertical">
            {categoryList?.map(i => (
              <Form.Item
                key={i.id}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryWrap
                      style={{ marginRight: 8, marginLeft: 0 }}
                      color={i.color}
                      bgColor={
                        colorList?.filter(k => k.key === i.color)[0]?.bgColor
                      }
                    >
                      {i.name}
                    </CategoryWrap>
                    指定新状态
                  </div>
                }
              >
                <Select
                  placeholder="请选择"
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                />
              </Form.Item>
            ))}
          </FormWrap>
        </CommonModal>
      )}
      <div
        style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 24 }}
      >
        <Button
          style={{ background: '#F0F4FA', color: '#2877ff' }}
          icon={<IconFont type="plus" />}
          onClick={() => setIsAddVisible(true)}
        >
          添加状态
        </Button>
        <span style={{ color: '#969799', fontSize: 12, marginLeft: 8 }}>
          支持添加、编辑和删除工作流状态
        </span>
      </div>
      <TableWrap>
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey="index"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </TableWrap>
      <div style={{ marginTop: 8, color: '#969799', fontSize: 12 }}>
        注：拖动图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
      </div>
    </>
  )
}

export default StepPageOne
