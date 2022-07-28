/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import IconFont from '@/components/IconFont'
import { Button, Menu, Dropdown, Pagination } from 'antd'
import styled from '@emotion/styled'
import { TableWrap, PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import EditDemand from '../components/EditDemand'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { OptionalFeld } from '@/components/OptionalFeld'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { OmitText } from '@star-yun/ui'

const Operation = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: 52,
  background: 'white',
})

const ButtonWrap = styled(Button)({
  color: '#2877ff',
  border: '1px solid #2877FF',
})

const StatusWrap = styled.div({
  height: 22,
  borderRadius: 6,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #2877FF',
  color: '#2877FF',
  width: 'fit-content',
  cursor: 'pointer',
})

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.anticon': {
    fontSize: 16,
  },
})

const IconFontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const RowIconFont = styled(IconFont)({
  visibility: 'hidden',
  fontSize: 16,
  cursor: 'pointer',
  color: '#2877ff',
})

const TableBox = styled(TableWrap)({
  '.ant-table-row:hover': {
    [RowIconFont.toString()]: {
      visibility: 'visible',
    },
  },
})

const statusList = [
  { id: 0, name: '规划中', color: '#2877ff' },
  { id: 1, name: '实现中', color: '#2877ff' },
  { id: 2, name: '已实现', color: '#2877ff' },
  { id: 3, name: '已关闭', color: '#2877ff' },
]

const priorityList = [
  { name: '高', type: 'tall', color: '#ff5c5e' },
  { name: '中', type: 'middle', color: '#fa9746' },
  { name: '低', type: 'low', color: '#43ba9a' },
  { name: '极低', type: 'knockdown', color: '#bbbdbf' },
]

export const plainOptions = [
  { label: 'id', value: 'name' },
  { label: 'id1', value: 'age' },
  { label: 'id2', value: 'address' },
  { label: 'id3', value: 'address1' },
  { label: 'id4', value: 'address2' },
]

export const plainOptions2 = [
  { label: '飞机', value: 'feiji' },
  { label: '大炮', value: 'dapao' },
  { label: '坦克', value: 'tanke' },
  { label: '直升机', value: 'zhishengji' },
  { label: '战舰', value: 'zhanjian' },
]

const ChildDemand = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [settingState, setSettingState] = useState(false)
  const [operationItem, setOperationItem] = useState<any>({})
  const { getDemandList } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const [dataList, setDataList] = useState<any>([])

  const getList = async () => {
    const result = await getDemandList({
      projectId,
      page: 1,
      pageSize: 10,
      order: 'asc',
      orderKey: 'id',
      parentId: demandId,
    })
    setDataList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const [titleList, setTitleList] = useState<CheckboxValueType[]>([
    'name',
    'age',
    'address',
  ])
  const [titleList2, setTitleList2] = useState<CheckboxValueType[]>([
    'feiji',
    'dapao',
    'tanke',
  ])

  const getCheckList = (
    keys: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(keys)
    setTitleList2(list2)
  }

  const onEdit = (item: any) => {
    setIsVisible(!isVisible)
    setOperationItem(item)
  }

  const menu = (item: any) => (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => onEdit(item)}>编辑</div>,
        },
        {
          key: '3',
          label: <div>删除</div>,
        },
      ]}
    />
  )

  const setMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => setSettingState(true)}>设置显示字段</div>,
        },
      ]}
    />
  )

  const columns = [
    {
      title: '项目ID',
      dataIndex: 'id',
      render: (text: string, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown
              overlay={menu(record)}
              trigger={['click']}
              placement="bottomRight"
              getPopupContainer={node => node}
            >
              <RowIconFont type="more" />
            </Dropdown>
            <div style={{ marginLeft: 32 }}>{text}</div>
          </div>
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return <OmitText width={200}>{text}</OmitText>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <LevelContent
                  onTap={() => {}}
                  onHide={onHide}
                  record={record}
                />
              )
            }}
            record={record}
          >
            <PriorityWrap>
              <IconFont
                type={text.icon}
                style={{
                  fontSize: 16,
                  color: text.color,
                }}
              />
              <div>{text.content}</div>
            </PriorityWrap>
          </PopConfirm>
        )
      },
      sorter: {
        compare: (a: any, b: any) => a.priority - b.priority,
      },
    },
    {
      title: '迭代',
      dataIndex: 'iteration',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: any, record: any) => {
        return (
          <PopConfirm
            content={({ onHide }: { onHide(): void }) => {
              return (
                <ShapeContent tap={() => {}} hide={onHide} record={record} />
              )
            }}
            record={record}
          >
            <StatusWrap color={text.color}>{text.content}</StatusWrap>
          </PopConfirm>
        )
      },
    },
    {
      title: '处理人',
      dataIndex: 'dealName',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计开始时间',
      dataIndex: 'expectedStart',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
    {
      title: '预计结束时间',
      dataIndex: 'expectedEnd',
      sorter: {
        compare: (a: any, b: any) => a.progress - b.progress,
      },
    },
  ]

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {

    //
  }

  const onShowSizeChange = (current: number, pageSize: number) => {

    //
  }

  const onChangeVisible = () => {
    setIsVisible(!isVisible)
    setOperationItem({})
  }

  return (
    <div>
      <EditDemand
        visible={isVisible}
        onChangeVisible={onChangeVisible}
        isChild
        id={operationItem.id}
        onUpdate={() => getList()}
      />
      <Operation>
        <ButtonWrap
          onClick={() => setIsVisible(true)}
          icon={<IconFont type="plus" />}
        >
          添加子需求
        </ButtonWrap>
        <Dropdown overlay={setMenu}>
          <IconFontWrap type="settings" />
        </Dropdown>
      </Operation>
      <TableBox
        rowKey="id"
        columns={columns}
        dataSource={dataList?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>
      <OptionalFeld
        plainOptions={plainOptions}
        plainOptions2={plainOptions2}
        checkList={titleList}
        checkList2={titleList2}
        isVisible={settingState}
        onClose={() => setSettingState(false)}
        getCheckList={getCheckList}
      />
    </div>
  )
}

export default ChildDemand
