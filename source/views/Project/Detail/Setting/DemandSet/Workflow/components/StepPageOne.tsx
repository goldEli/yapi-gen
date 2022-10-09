/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable no-undefined */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  Form,
  Radio,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  message,
} from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useImperativeHandle, useState } from 'react'
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
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'

const TableWrap = styled.div({
  width: '100%',
  height: 'calc(100% - 204px)',
  overflowY: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '.ant-spin-nested-loading': {
    width: '100%',
  },
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

interface Props {
  onChangeStep(val: any): void
  onRef: any
}

const StepPageOne = (propsOne: Props) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const {
    colorList,
    getWorkflowList,
    deleteStoryConfigWorkflow,
    updateStoryConfigWorkflow,
    sortchangeWorkflow,
  } = useModel('project')
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()
  const [isSpinning, setIsSpinning] = useState(false)
  const [dataSource, setDataSource] = useState<any>({
    list: undefined,
  })

  const getList = async () => {
    setIsSpinning(true)
    const result = await getWorkflowList({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
    })
    setDataSource(result)
    setIsSpinning(false)
  }

  useEffect(() => {
    getList()
  }, [])

  const onClickOperation = (row: any, type: string) => {
    setOperationObj(row)
    if (type === 'edit') {
      setIsVisible(true)
    } else {
      Number(row.deleteData?.story_count)
        ? setIsHasDelete(true)
        : setIsDelVisible(true)
    }
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
  }

  const onConfirmHasDelete = async () => {
    const obj = {
      projectId: paramsData.id,
      id: operationObj?.id,
      item: {
        status_id: form.getFieldValue('statusId'),
        category_id: categoryItem?.id,
      },
    }

    try {
      await deleteStoryConfigWorkflow(obj)
      message.success('删除成功')
      getList()
      setOperationObj({})
      setIsHasDelete(false)
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {

      //
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteStoryConfigWorkflow({
        projectId: paramsData.id,
        id: operationObj?.id,
      })
      message.success('删除成功')
      getList()
      setOperationObj({})
      setIsDelVisible(false)
    } catch (error) {

      //
    }
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const onUpdate = () => {
    getList()
  }

  const onChangeListStatus = async (checked: any, row: any) => {
    if (row.startStatus) {
      message.warning('起始状态与结束状态不能同时存在')
      return
    }
    const obj = {
      projectId: paramsData.id,
      id: row.id,
      endStatus: checked ? 1 : 2,
    }
    try {
      await updateStoryConfigWorkflow(obj)
      message.success('修改成功')
      getList()
    } catch (error) {

      //
    }
  }

  const onchangeRadio = async (e: any, row: any) => {
    const obj = {
      projectId: paramsData.id,
      id: row.id,
      startStatus: e.target.checked ? 1 : 2,
    }
    try {
      await updateStoryConfigWorkflow(obj)
      message.success('修改成功')
      getList()
    } catch (error) {

      //
    }
  }

  const DragHandle = sortableHandle(() => (
    <IconFont
      type="move"
      style={{ fontSize: 16, cursor: 'pointer', color: '#969799' }}
    />
  ))

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
        dataSource?.list?.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      setDataSource({ list: newData })
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
    const index = dataSource?.list?.findIndex(
      (x: any) => x.index === restProps['data-row-key'],
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
      dataIndex: 'info',
      render: (text: any) => <OmitText width={380}>{text || '--'}</OmitText>,
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
      render: (text: any, record: any) => <Radio checked={text} onChange={e => onchangeRadio(e, record)} />
      ,
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
      render: (text: any, record: any) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          checked={text}
          onChange={checked => onChangeListStatus(checked, record)}
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

  const onSaveMethod = async () => {
    await sortchangeWorkflow({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      ids: dataSource?.list?.map((i: any) => ({ id: i.id })),
    })
  }

  const onSave = () => {
    if (!dataSource?.list?.length) {
      message.warning('至少保证有已经添加一个需求状态')
      return
    }
    try {
      onSaveMethod()
      message.success('保存成功')
      propsOne?.onChangeStep(2)
    } catch (error) {

      //
    }
  }

  useImperativeHandle(propsOne.onRef, () => {
    return {
      onSave: onSaveMethod,
    }
  })

  return (
    <>
      {isAddVisible && (
        <AddWorkflow
          isVisible={isAddVisible}
          onUpdate={onUpdate}
          onClose={() => setIsAddVisible(false)}
        />
      )}
      {isVisible && (
        <EditWorkflow
          item={operationObj}
          isVisible={isVisible}
          onClose={onClose}
          onUpdate={() => getList()}
        />
      )}
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
          <HasDemandText>{`共有${operationObj?.deleteData?.story_count}个需求当前处于【${operationObj?.name}】，删除状态后您需要为这些需求分配一个新的状态`}</HasDemandText>
          <FormWrap form={form} layout="vertical">
            <Form.Item
              name="statusId"
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryWrap
                    style={{ marginRight: 8, marginLeft: 0 }}
                    color={operationObj?.deleteData?.item?.category_color}
                    bgColor={
                      colorList?.filter(
                        k => k.key
                          === operationObj?.deleteData?.item?.category_color,
                      )[0]?.bgColor
                    }
                  >
                    {operationObj?.deleteData?.item?.category_name}
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
                options={operationObj?.deleteData?.item?.status?.map(
                  (i: any) => ({ label: i.content, value: i.id }),
                )}
              />
            </Form.Item>
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
        <Spin spinning={isSpinning}>
          {!!dataSource?.list
            && (dataSource?.list?.length > 0 ? (
              <div style={{ width: '100%' }}>
                <Table
                  pagination={false}
                  dataSource={dataSource?.list}
                  columns={columns}
                  rowKey="index"
                  components={{
                    body: {
                      wrapper: DraggableContainer,
                      row: DraggableBodyRow,
                    },
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    color: '#969799',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  注：拖动
                  <IconFont
                    type="move"
                    style={{
                      fontSize: 14,
                    }}
                  />
                  图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
                </div>
              </div>
            )
              : <NoData />
            )}
        </Spin>
      </TableWrap>
      <Space size={16} style={{ position: 'absolute', bottom: 24, left: 24 }}>
        <Button type="primary" onClick={onSave}>
          保存&下一步
        </Button>
      </Space>
    </>
  )
}

export default StepPageOne
