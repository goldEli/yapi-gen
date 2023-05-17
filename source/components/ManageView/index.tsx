/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
// eslint-disable-next-line no-duplicate-imports
import type React from 'react'
import CommonModal from '../CommonModal'
import {
  Form,
  Input,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  Typography,
} from 'antd'
import { useDispatch, useSelector } from '@store/index'
import { changeViewVisible } from '@store/view'
import { delViews, editViews } from '@/services/view'
import { getViewList } from '@store/view/thunk'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import NewLoadingTransition from '../NewLoadingTransition'
import NoData from '../NoData'
import styled from '@emotion/styled'
import DeleteConfirm from '../DeleteConfirm'
import { getMessage } from '../Message'

const TableWrap = styled.div`
  padding: 0 4px 0 24px;
  .ant-table-thead > tr > th {
    border-bottom: none;
    font-size: 12px;
    color: var(--neutral-n3);
  }
  .ant-table-content {
    overflow-y: auto;
  }
`

// interface Item {
//   key: string
//   name: string
//   viewType: string
//   state: boolean
//   isC?: any
// }

// interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
//   editing: boolean
//   dataIndex: string
//   title: any
//   inputType: 'number' | 'text' | 'switch'
//   record: Item
//   index: number
//   children: React.ReactNode
// }
// const EditableCell: React.FC<EditableCellProps> = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const getNode = (type: string) => {
//     console.log(type, '=typetypetype')
//     if (type === 'text') {
//       return <Input />
//     } else if (type === 'switch') {
//       return <Switch />
//     }
//     return null
//   }
//   const inputNode = getNode(inputType)
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           // eslint-disable-next-line no-undefined
//           valuePropName={inputType === 'switch' ? 'checked' : undefined}
//           name={dataIndex}
//           style={{ margin: 0 }}
//           rules={[
//             {
//               required: true,
//               message: '',
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   )
// }

// const ManageView = (props: any) => {
//   const [form] = Form.useForm()
//   const dispatch = useDispatch()
//   const [data, setData] = useState<Item[]>([])
//   const [editingKey, setEditingKey] = useState('')
//   const isEditing = (record: Item) => record.key === editingKey
//   const { viewVisible, viewList } = useSelector(state => state.view)

//   const getData = () => {
//     setData(
//       viewList.map((i: any) => {
//         return {
//           key: i.id,
//           name: i.name,
//           viewType: i.type === 2 ? t('systemView') : t('personalView'),
//           state: i.status === 1,
//           isC: i.type,
//         }
//       }),
//     )
//   }
//   useEffect(() => {
//     if (viewVisible) {
//       getData()
//     }
//   }, [viewVisible])

//   const edit = (record: Partial<Item> & { key: React.Key }) => {
//     form.setFieldsValue({ name: '', viewType: '', state: '', ...record })
//     setEditingKey(record.key)
//   }

//   const cancel = (key: React.Key) => {
//     const newData = [...data]
//     const index = newData.findIndex(item => key === item.key)
//     newData.splice(index, 1)
//     delViews({
//       id: key,
//       project_id: props.pid,
//     })
//     setData(newData)
//     setEditingKey('')
//   }

//   const save = async (key: React.Key) => {
//     try {
//       const row = (await form.validateFields()) as Item

//       const newData = [...data]
//       const index = newData.findIndex(item => key === item.key)
//       if (index > -1) {
//         const item = newData[index]
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         })
//         setData(newData)
//         setEditingKey('')
//       } else {
//         newData.push(row)
//         setData(newData)
//         setEditingKey('')
//       }
//       editViews({
//         state: row.state,
//         name: row.name,
//         id: key,
//         project_id: props.pid,
//       })
//     } catch (errInfo) {
//       throw new Error('something bad')
//     }
//   }

//   const columns = [
//     {
//       title: t('name_of_view'),
//       dataIndex: 'name',
//       width: '30%',
//       editable: true,
//     },
//     {
//       title: t('type_of_view'),
//       dataIndex: 'viewType',
//       width: '20%',
//       editable: false,
//     },
//     {
//       title: t('newlyAdd.endStatus'),
//       dataIndex: 'state',
//       width: '30%',
//       editable: true,
//       render: (p: any, record: Item) => {
//         return record.state ? t('common.open') : t('common.close')
//       },
//     },
//     {
//       title: t('newlyAdd.operation'),
//       dataIndex: 'operation',
//       render: (p: any, record: Item) => {
//         const isC = record.isC === 2
//         const editable = isEditing(record)
//         if (isC) {
//           return <span>- -</span>
//         }
//         return editable ? (
//           <span>
//             <Typography.Link
//               onClick={() => save(record.key)}
//               style={{ marginRight: 8 }}
//             >
//               {t('container.finish') as string}
//             </Typography.Link>

//             <a onClick={() => setEditingKey('')}>{t('cancel') as string}</a>
//           </span>
//         ) : (
//           <span>
//             <Typography.Link
//               style={{ marginRight: 8 }}
//               disabled={editingKey !== ''}
//               onClick={() => edit(record)}
//             >
//               {t('common.edit') as string}
//             </Typography.Link>
//             <Popconfirm
//               overlayInnerStyle={{ padding: '10px' }}
//               title={t('confirmDeletingTheView') as string}
//               onConfirm={() => cancel(record.key)}
//             >
//               <Typography.Link disabled={editingKey !== ''}>
//                 {t('common.del') as string}
//               </Typography.Link>
//             </Popconfirm>
//           </span>
//         )
//       },
//     },
//   ]
//   const getInputType = (dataIndex: string) => {
//     let type = ''
//     switch (dataIndex) {
//       case 'name':
//         type = 'text'
//         break
//       case 'state':
//         type = 'switch'
//         break
//       default:
//         break
//     }
//     return type
//   }
//   const mergedColumns = columns.map(col => {
//     if (!col.editable) {
//       return col
//     }
//     return {
//       ...col,
//       onCell: (record: Item) => ({
//         record,
//         inputType: getInputType(col.dataIndex),
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     }
//   })
//   return (
//     <CommonModal
//       width={784}
//       title={t('view_management')}
//       onClose={() => {
//         dispatch(changeViewVisible(false))
//         dispatch(getViewList(props.pid))
//       }}
//       isVisible={viewVisible}
//       hasFooter={true}
//     >
//       <div
//         style={{
//           padding: ' 8px 24px',
//           background: 'var(--neutral-white-d2)',
//           height: '500px',
//           overflow: 'auto',
//         }}
//       >
//         <Form form={form} component={false}>
//           <Table
//             components={{
//               body: {
//                 cell: EditableCell,
//               },
//             }}
//             dataSource={data}
//             columns={mergedColumns}
//             rowClassName="editable-row"
//             pagination={false}
//           />
//         </Form>
//       </div>
//     </CommonModal>
//   )
// }

// export default ManageView

interface Item {
  key: string
  name: string
  viewType: string
  state: boolean
  isC?: any
}

const ManageView = (props: { projectId: number }) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { viewVisible, viewList } = useSelector(state => state.view)
  const [operationObj, setOperationObj] = useState<any>({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [data, setData] = useState<Item[]>([])

  const getData = () => {
    setData(
      viewList.map((i: any) => {
        return {
          key: i.id,
          name: i.name,
          viewType: i.type === 2 ? t('systemView') : t('personalView'),
          state: i.status === 1,
          isC: i.type,
        }
      }),
    )
  }

  const onAddEdit = (record: Item) => {
    //
  }

  const onDelete = (record: Item) => {
    setIsDeleteVisible(true)
    setOperationObj(record)
  }

  const onChangeStatus = async (checked: boolean, record: Item) => {
    const newData = [...data]
    newData.map((i: Item) => ({
      ...i,
      state: checked,
    }))
    setData(newData)
    // editViews({
    //   state: checked,
    //   name: record.name,
    //   id: record.key,
    //   project_id: props.projectId,
    // })
  }

  console.log(data)

  const columns = [
    {
      title: t('name_of_view'),
      dataIndex: 'name',
      width: 240,
    },
    {
      title: t('type_of_view'),
      dataIndex: 'viewType',
      width: 240,
    },
    {
      title: t('newlyAdd.endStatus'),
      dataIndex: 'state',
      width: 132,
      render: (p: any, record: Item) => {
        return (
          <Switch
            onChange={checked => onChangeStatus(checked, record)}
            checked={record.state}
          />
        )
      },
    },
    {
      width: 104,
      title: t('newlyAdd.operation'),
      dataIndex: 'action',
      render: (text: string, record: Item) => (
        <>
          {operationObj?.key === record.key && !isDeleteVisible ? (
            <Space size={16}>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onAddEdit(record)}
              >
                完成
              </span>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => {
                  setOperationObj(false)
                }}
              >
                取消
              </span>
            </Space>
          ) : (
            <Space size={16}>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onAddEdit(record)}
              >
                {t('common.edit')}
              </span>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onDelete(record)}
              >
                {t('common.del')}
              </span>
            </Space>
          )}
        </>
      ),
    },
  ]

  const onClose = () => {
    dispatch(changeViewVisible(false))
    dispatch(getViewList(props.projectId))
    setOperationObj({})
  }

  const onCloseDelete = () => {
    setOperationObj({})
    setIsDeleteVisible(false)
  }

  // 删除事件
  const onConfirmDelete = () => {
    const newData = [...data]
    const index = newData.findIndex(item => operationObj.key === item.key)
    newData.splice(index, 1)
    delViews({
      id: operationObj.key,
      project_id: props.projectId,
    })
    setData(newData)
    onCloseDelete()
    getMessage({ type: 'success', msg: '删除成功！' })
  }

  useEffect(() => {
    if (viewVisible) {
      getData()
    }
  }, [viewVisible])

  return (
    <>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        onChangeVisible={onCloseDelete}
        text={t('confirmDeletingTheView')}
        onConfirm={onConfirmDelete}
      />
      <CommonModal
        isVisible={viewVisible}
        title={t('view_management')}
        onClose={onClose}
        width={784}
        bodyStyle={{ height: '60vh' }}
        hasFooter
      >
        <TableWrap>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            {!!data &&
              (data?.length > 0 ? (
                <Table
                  dataSource={data}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                  scroll={{
                    y: '48vh',
                  }}
                />
              ) : (
                <NoData />
              ))}
          </Spin>
        </TableWrap>
      </CommonModal>
    </>
  )
}

export default ManageView
