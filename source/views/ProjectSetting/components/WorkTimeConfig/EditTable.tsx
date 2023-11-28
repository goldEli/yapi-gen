import { DatePicker, Form, Input, InputRef, Table, TimePicker } from 'antd'
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import moment from 'moment'
import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { DisableButton, OperationBox, TableBox } from './style'
import {
  getExceptionTimeList,
  delExceptionTime,
  addExceptionTime,
  editExceptionTime,
} from '@/services/map'
import { getMessage } from '@/components/Message'
import useProjectId from '../KanBanSetting/hooks/useProjectId'
import { useDispatch, useSelector } from '@store/index'

interface Item {
  id: number
  name: string
  start_date: any
  end_date: any
  morning: any[]
  afternoon: any[]
  night: any[]
  operation: any
}

interface EditableCellProps {
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  editing: boolean
}
const EditableCell: React.FC<EditableCellProps> = ({
  children,
  dataIndex,
  editing,
  ...restProps
}) => {
  let childNode = children
  const inputRef = useRef<InputRef>(null)
  const getDisableTime = () => {
    const arr = []
    for (let i = 1; i < 60; i++) {
      arr.push(i)
    }
    return arr
  }
  useEffect(() => {
    if (editing && dataIndex === 'name') {
      inputRef.current!.focus()
    }
  }, [editing])

  const getHtmlForData = (type: string) => {
    switch (type) {
      case 'name':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
          >
            <Input ref={inputRef} />
          </Form.Item>
        )
      case 'start_date':
      case 'end_date':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
        )
      case 'morning':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 12) {
                      return getDisableTime()
                    }
                    return []
                  },
                }
              }}
            />
          </Form.Item>
        )
      case 'afternoon':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 22, 23,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 12) {
                      return [0]
                    }
                    if (hours === 20) {
                      return getDisableTime()
                    }
                    return []
                  },
                }
              }}
            />
          </Form.Item>
        )
      case 'night':
        return (
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            <TimePicker.RangePicker
              format="HH:mm"
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 20) {
                      return [0]
                    }
                    return []
                  },
                }
              }}
            />
          </Form.Item>
        )
      default:
        return null
    }
  }
  if (dataIndex !== 'operation') {
    childNode = editing ? (
      getHtmlForData(dataIndex)
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

interface DataType {
  id: number
  name: string
  start_date: any
  end_date: any
  morning: any[]
  afternoon: any[]
  night: any[]
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>
const EditTable = (props: any, ref: any) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [editingKey, setEditingKey] = useState<number>(0)
  const isEditing = (record: Item) => record.id === editingKey
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const { projectId } = useProjectId()
  const [searchObject, setSearchObject] = useState({
    page: 1,
    pagesize: 5,
    total: 0,
  })
  const [t] = useTranslation()
  const [dataSource, setDataSource] = useState<DataType[]>([])

  const handleDelete = async (id: number) => {
    const result = await delExceptionTime({
      project_id: projectId,
      id,
    })
    if (result && result.data) {
      getMessage({
        msg: '删除成功',
        type: 'success',
      })
      getDataList({
        ...searchObject,
        page:
          searchObject.page !== 1 && dataSource.length === 1
            ? searchObject.page - 1
            : searchObject.page,
      })
    }
  }

  // 点击编辑按钮
  const edit = (record: Item) => {
    form.setFieldsValue({
      name: record.name,
      start_date: moment(record.start_date, 'YYYY-MM-DD'),
      end_date: moment(record.end_date, 'YYYY-MM-DD'),
      morning: record.morning
        .filter((l: any) => l)
        .map((s: any) => moment(s, 'HH:mm')),
      afternoon: record.afternoon
        .filter((l: any) => l)
        .map((s: any) => moment(s, 'HH:mm')),
      night: record.night
        .filter((l: any) => l)
        .map((s: any) => moment(s, 'HH:mm')),
    })
    setEditingKey(record.id)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      editable: true,
    },
    {
      width: 200,
      title: '开始时间',
      dataIndex: 'start_date',
      render: text => <div>{moment(text).format('YYYY-MM-DD')}</div>,
      editable: true,
    },
    {
      width: 200,
      title: '结束时间',
      dataIndex: 'end_date',
      editable: true,
      render: text => <div>{moment(text).format('YYYY-MM-DD')}</div>,
    },
    {
      width: 220,
      title: '上午',
      dataIndex: 'morning',
      editable: true,
      render: (text: any) => <div>{text?.join('-')}</div>,
    },
    {
      width: 220,
      title: '下午',
      dataIndex: 'afternoon',
      editable: true,
      render: (text: any) => <div>{text?.join('-')}</div>,
    },
    {
      title: '晚上',
      dataIndex: 'night',
      editable: true,
      width: 220,
      render: (text: any) => <div>{text?.join('-')}</div>,
    },
    {
      align: 'center',
      title: '操作',
      width: 120,
      dataIndex: 'operation',
      fixed: 'right',
      editable: true,
      render: (_, record: any) => {
        const editable = isEditing(record)
        return (
          <OperationBox>
            {editable ? (
              <>
                <span
                  onClick={() => save(record.id)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </span>
                <span
                  onClick={() => {
                    if (editingKey === -1) {
                      const arr = [...dataSource]
                      arr.shift()
                      setDataSource(arr)
                      setEditingKey(0)
                    } else {
                      setEditingKey(0)
                    }
                    form.resetFields()
                  }}
                >
                  取消
                </span>
              </>
            ) : (
              <DisableButton disabled={editingKey !== 0}>
                <span
                  onClick={() => {
                    if (editingKey !== 0) {
                      return
                    }
                    edit(record)
                  }}
                >
                  编辑
                </span>
                <span
                  onClick={() => {
                    if (editingKey !== 0) {
                      return
                    }
                    open({
                      title: '删除确认',
                      children: <div>确认删除该日期？</div>,
                      onConfirm: async () => {
                        await handleDelete(record.id)
                      },
                    })
                  }}
                >
                  删除
                </span>
              </DisableButton>
            )}
          </OperationBox>
        )
      },
    },
  ]

  // 保存按钮
  const save = async (id: number) => {
    try {
      const value = (await form.validateFields()) as Item
      let result: any
      const params = {
        project_id: projectId,
        start_date: moment(value.start_date).format('YYYY-MM-DD'),
        end_date: moment(value.end_date).format('YYYY-MM-DD'),
        name: value.name,
        date_config: {
          morning: {
            begin: moment(value.morning?.[0]).format('HH:mm'),
            end: moment(value.morning?.[1]).format('HH:mm'),
          },
          afternoon: {
            begin: moment(value.afternoon?.[0]).format('HH:mm'),
            end: moment(value.afternoon?.[1]).format('HH:mm'),
          },
          night: {
            begin: value?.night?.length
              ? moment(value.night?.[0]).format('HH:mm')
              : '',
            end: value?.night?.length
              ? moment(value.night?.[1]).format('HH:mm')
              : '',
          },
        },
      }
      if (id === -1) {
        result = await addExceptionTime(params)
      } else {
        result = await editExceptionTime({
          ...params,
          id,
        })
      }
      if (result && result.data) {
        if (id === -1) {
          getMessage({
            msg: '添加成功',
            type: 'success',
          })
        } else {
          getMessage({
            msg: '编辑成功',
            type: 'success',
          })
        }
        setEditingKey(0)
        form.resetFields()
        getDataList(searchObject)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const handleAdd = () => {
    if (editingKey !== 0) {
      return
    }
    const newData: DataType = {
      id: -1,
      name: '',
      start_date: '',
      end_date: '',
      morning: [],
      afternoon: [],
      night: [],
    }
    setDataSource([newData, ...dataSource])
    setEditingKey(-1)
  }

  // 获取例外时间表格
  const getDataList = async (page: any) => {
    const result = await getExceptionTimeList({
      project_id: projectId,
      page: page.page,
      pagesize: page.pagesize,
    })
    if (result && result.data) {
      setDataSource(
        result.data?.list?.map((k: any) => {
          return {
            id: k.id,
            name: k.name,
            start_date: k.start_date,
            end_date: k.end_date,
            morning: [k.date_config?.morning.begin, k.date_config?.morning.end],
            afternoon: [
              k.date_config?.afternoon?.begin,
              k.date_config?.afternoon?.end,
            ],
            night: [k.date_config?.night?.begin, k.date_config?.night?.end],
          }
        }),
      )
      setSearchObject({
        ...result?.data?.pager,
      })
    }
  }

  useEffect(() => {
    getDataList(searchObject)
  }, [])
  useImperativeHandle(ref, () => {
    return {
      handleAdd,
    }
  })
  return (
    <div>
      <DeleteConfirmModal />
      {/* <AddWrap onClick={handleAdd} hasColor>
        <IconFont type="plus" />
        <div>添加例外</div>
      </AddWrap> */}
      {dataSource.length > 0 ? (
        <Form form={form} autoComplete="off">
          <TableBox>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowClassName={() => 'editable-row'}
              dataSource={dataSource}
              columns={columns as ColumnTypes}
              scroll={{ x: 1200, y: 260 }}
              pagination={{
                total: searchObject.total,
                defaultPageSize: searchObject.pagesize,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: [5, 10, 15, 20],
                onChange(page, pageSize) {
                  setSearchObject({
                    ...searchObject,
                    page,
                    pagesize: pageSize,
                  })
                  // getDataList({
                  //   page,
                  //   pagesize: pageSize,
                  // })
                },
                showTotal(total: any) {
                  return `${t('sprint.total')} ${total} ${t('sprint.pieces')}`
                },
              }}
            />
          </TableBox>
        </Form>
      ) : null}
    </div>
  )
}

export default forwardRef(EditTable)
