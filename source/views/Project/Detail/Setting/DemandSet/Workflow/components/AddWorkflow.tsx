/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import { Input, message, Space, Table } from 'antd'
import ChooseColor from '../../components/ChooseColor'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { ViewWrap } from '@/components/StyleCommon'

const TableWrap = styled(Table)({
  maxHeight: 400,
  overflowY: 'auto',
  '.ant-checkbox-wrapper': {
    marginLeft: 8,
  },
  '.ant-table-cell': {
    position: 'relative',
  },
})

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

const data = [
  {
    key: '1',
    name: '实现中',
    color: '#43BA9A',
    remark: '说明文字内容说明文字内容说明文字内容说明文字内容说',
    endStatus: false,
    startStatus: true,
    id: 9,
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
    id: 1,
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
    id: 2,
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

interface AddActiveWrapProps {
  onClose?(): void
  onConfirm?(obj: any): void
  hasMargin?: boolean
  item?: any
}

const AddActiveWrap = (props: AddActiveWrapProps) => {
  const [value, setValue] = useState<any>('')
  const [errorState, setErrorState] = useState(false)
  const [normalColor, setNormalColor] = useState<any>()

  useEffect(() => {
    if (props?.item?.id) {
      setValue(props?.item.name)
      setNormalColor(props?.item.color)
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose?.()
    setValue('')
    setNormalColor('')
    setErrorState(false)
  }

  const onClose = () => {
    onReset()
  }

  const onConfirm = () => {
    if (!value) {
      setErrorState(true)
      return
    }
    if (!normalColor) {
      message.warning('请选择状态颜色！')
      return
    }
    props?.onConfirm?.({ name: value, color: normalColor })
    onReset()
  }

  const onChangeValue = (val: string | undefined) => {
    setNormalColor(val)
  }

  const onChangeInpValue = (val: any) => {
    setValue(val)
    setErrorState(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: props?.hasMargin ? '10px 0' : '0',
      }}
    >
      <Input
        style={{
          width: 196,
          margin: props?.hasMargin ? '0 16px' : '0 16px 0 0',
          border: errorState ? '1px solid #FF5C5E' : '1px solid #EBEDF0',
        }}
        placeholder="请输入状态名称"
        allowClear
        onChange={e => onChangeInpValue(e.target.value)}
        value={value}
      />
      <ChooseColor
        color={normalColor}
        onChangeValue={val => onChangeValue(val)}
      />
      <TextWrap
        style={{ margin: '0 16px 0 24px', color: '#2877ff' }}
        onClick={onConfirm}
      >
        完成
      </TextWrap>
      <TextWrap style={{ color: '#646566' }} onClick={onClose}>
        取消
      </TextWrap>
    </div>
  )
}

interface ChangeTableNameProps {
  record: any
  text: string
  operationObj: any
  onClose?(): void
  onConfirm?(obj: any): void
}

const ChangeTableName = (props: ChangeTableNameProps) => {
  return (
    <div>
      {props?.operationObj?.id === props?.record?.id ? (
        <div style={{ position: 'absolute', zIndex: 2, top: 10, width: 680 }}>
          <AddActiveWrap
            onClose={props?.onClose}
            onConfirm={props?.onConfirm}
            item={props?.operationObj}
          />
        </div>
      ) : null}
      <ViewWrap color={props?.record?.color}>{props?.text}</ViewWrap>
    </div>
  )
}

const AddWorkflow = (props: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [isAdd, setIsAdd] = useState(false)
  const [dataList, setDataList] = useState(data)
  const [operationObj, setOperationObj] = useState<any>({})

  const onConfirm = () => {

    // console.log(form.getFieldsValue(), 'form.getFieldsValue()')
    props?.onUpdate?.()
  }

  const onClose = () => {
    props?.onClose()
    setIsAdd(false)
    setSelectedRowKeys([])
  }

  const onAddConfirm = (obj: any) => {

    // console.log(obj, '====')
    // 调用添加状态的接口
  }

  const onChangeName = (obj: any) => {
    const idx = dataList.findIndex(i => i.id === operationObj.id)
    const arr = dataList
    arr[idx].color = obj.color
    arr[idx].name = obj.name
    setDataList(arr)
    setOperationObj({})

    // 调用编辑状态的接口
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {

    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const onAddDel = (row: any) => {
    const arr = dataList.filter(i => i.id !== row.id)
    setDataList(arr)
  }

  const onAddEdit = (row: any) => {
    setOperationObj(row)
  }

  const columns = [
    {
      width: 244,
      title: '',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <ChangeTableName
          record={record}
          text={text}
          operationObj={operationObj}
          onClose={() => setOperationObj({})}
          onConfirm={obj => onChangeName(obj)}
        />
      ),
    },
    {
      width: 314,
      title: '',
      dataIndex: 'hasCategory',
      render: (text: any, record: any) => (
        <>
          {operationObj?.id === record.id
            ? ''
            : (
                <OmitText width={300}>
                  {text ? text.map((i: any) => i.name).join('、') : '--'}
                </OmitText>
              )}
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <>
          {operationObj?.id === record.id
            ? ''
            : (
                <Space size={16}>
                  <span
                    style={{ color: '#2877ff', cursor: 'pointer' }}
                    onClick={() => onAddEdit(record)}
                  >
                编辑
                  </span>
                  <span
                    style={{ color: '#2877ff', cursor: 'pointer' }}
                    onClick={() => onAddDel(record)}
                  >
                删除
                  </span>
                </Space>
              )}
        </>
      ),
    },
  ]

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
      {isAdd ? (
        <AddActiveWrap
          hasMargin
          onClose={() => setIsAdd(false)}
          onConfirm={obj => onAddConfirm(obj)}
        />
      ) : null}
      {!isAdd && (
        <div onClick={() => setIsAdd(true)}>
          <AddWrap />
        </div>
      )}
      <TableWrap
        rowSelection={rowSelection}
        dataSource={dataList}
        columns={columns}
        showHeader={false}
        pagination={false}
        rowKey="id"
      />
    </CommonModal>
  )
}

export default AddWorkflow
