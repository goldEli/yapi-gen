/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import { Input, Space, Switch, Table } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import { changeViewVisible } from '@store/view'
import { delViews, editViews } from '@/services/view'
import { getViewList } from '@store/view/thunk'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
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
  const { viewVisible, viewList, createViewPort } = useSelector(
    state => state.view,
  )
  const [operationObj, setOperationObj] = useState<any>({})
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const [data, setData] = useState<Item[]>([])
  const [viewName, setViewName] = useState('')

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
    setOperationObj(record)
    setViewName(record.name)
  }

  const onDelete = (record: Item) => {
    setIsDeleteVisible(true)
    setOperationObj(record)
  }

  // 切换结束状态
  const onChangeStatus = async (checked: boolean, record: Item) => {
    const newData = [...data]
    const list = newData.map((i: Item) => ({
      ...i,
      state: i.key === record.key ? checked : i.state,
    }))
    setData(list)
    editViews({
      state: checked,
      name: record.name,
      id: record.key,
      project_id: props.projectId,
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
  }

  // 修改视图名称
  const onChangeName = (value: string, record: Item) => {
    if (window.isCloseView) {
      window.isCloseView = false
      setOperationObj({})
      return
    }
    if (!value) {
      getMessage({ type: 'warning', msg: t('other.viewNotNull') })
      return
    }
    const newData = [...data]
    const list = newData.map((i: Item) => ({
      ...i,
      name: i.key === record.key ? value : i.name,
    }))
    setData(list)
    editViews({
      state: record.state,
      name: value,
      id: record.key,
      project_id: props.projectId,
    })
    getMessage({ type: 'success', msg: t('common.editSuccess') })
    setTimeout(() => {
      setOperationObj({})
    }, 200)
  }

  const columns = [
    {
      title: t('name_of_view'),
      dataIndex: 'name',
      width: 240,
      render: (p: any, record: Item) => {
        return (
          <>
            {operationObj?.key === record.key && !isDeleteVisible ? (
              <Input
                autoFocus
                value={viewName}
                onChange={e => setViewName(e.target.value)}
                onBlur={(e: any) => onChangeName?.(e.target.value, record)}
                onPressEnter={(e: any) => onChangeName(e.target.value, record)}
              />
            ) : (
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => onAddEdit(record)}
              >
                {p}
              </span>
            )}
          </>
        )
      },
    },
    {
      title: t('type_of_view'),
      dataIndex: 'viewType',
      width: 240,
      render: (p: any, record: Item) => {
        return (
          <>
            {operationObj?.key === record.key && !isDeleteVisible ? (
              ''
            ) : (
              <span>{p}</span>
            )}
          </>
        )
      },
    },
    {
      title: t('newlyAdd.endStatus'),
      dataIndex: 'state',
      width: 132,
      render: (p: any, record: Item) => {
        return (
          <>
            {operationObj?.key === record.key && !isDeleteVisible ? (
              ''
            ) : (
              <Switch
                onChange={checked => onChangeStatus(checked, record)}
                checked={record.state}
              />
            )}
          </>
        )
      },
    },
    {
      width: 104,
      title: t('newlyAdd.operation'),
      dataIndex: 'action',
      render: (text: string, record: Item) => (
        <>
          {record.isC === 2 && <span>--</span>}
          {record.isC !== 2 && (
            <>
              {operationObj?.key === record.key && !isDeleteVisible && (
                <Space size={16}>
                  <span
                    style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                    onClick={() => (window.isCloseView = true)}
                  >
                    {t('container.finish')}
                  </span>
                  <span
                    style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                    onMouseDown={() => {
                      window.isCloseView = true
                    }}
                  >
                    {t('common.cancel')}
                  </span>
                </Space>
              )}
              {!(operationObj?.key === record.key && !isDeleteVisible) && (
                <Space size={16}>
                  <span
                    style={{
                      color: 'var(--primary-d2)',
                      cursor: operationObj.key ? 'no-drop' : 'pointer',
                    }}
                    onClick={() =>
                      operationObj.key ? void 0 : onAddEdit(record)
                    }
                  >
                    {t('common.edit')}
                  </span>
                  <span
                    style={{
                      color: 'var(--primary-d2)',
                      cursor: operationObj.key ? 'no-drop' : 'pointer',
                    }}
                    onClick={() =>
                      operationObj.key ? void 0 : onDelete(record)
                    }
                  >
                    {t('common.del')}
                  </span>
                </Space>
              )}
            </>
          )}
        </>
      ),
    },
  ]

  const onClose = () => {
    dispatch(changeViewVisible(false))
    dispatch(
      getViewList({ projectId: props.projectId, type: createViewPort.type }),
    )
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
    getMessage({ type: 'success', msg: t('common.deleteSuccess') })
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
        </TableWrap>
      </CommonModal>
    </>
  )
}

export default ManageView
