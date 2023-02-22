import styled from '@emotion/styled'
import table from 'antd/lib/table'

const TableStyle = styled(table)`
  .ant-table-thead > tr > th,
  .ant-table-thead > tr .ant-table-cell {
    border: none;
    font-weight: 500;
    color: var(--neutral-n3);
    font-size: 12px;
    background-color: var(--neutral-white-d1);
  }
  .ant-table-tbody > tr > td {
    color: var(--neutral-n1-d1);
    font-size: 14px;
    font-weight: 400;
    background-color: var(--neutral-white-d1);
  }
  .ant-table-cell-row-hover {
    background-color: var(--hover-d2);
  }
  .ant-table-cell:hover {
    cursor: pointer;
  }
`
const OperationWrap = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--primary-d2);
  span {
    margin-right: 16px;
  }
  span:hover {
    cursor: pointer;
  }
`
const Table = (props: any) => {
  const columns: any = [
    {
      align: 'left',
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '真实姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '性别',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '邮箱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '手机',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '部门',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '职位',
      dataIndex: 'name',
      key: 'name',
    },
    {
      align: 'left',
      title: '团队角色',
      dataIndex: 'name',
      key: 'name',
    },
    {
      width: 196,
      align: 'left',
      title: '操作',
      render: (text: string, record: any) => (
        <OperationWrap>
          <span onClick={() => props.onEditRow(record, 'edit')}>编辑</span>
          <span onClick={() => props.onDelRow(record)}>移出</span>
          <span onClick={() => props.onEditRow(record, 'detail')}>详情</span>
        </OperationWrap>
      ),
    },
  ]
  return (
    <TableStyle
      columns={columns}
      dataSource={[
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
        { name: '123' },
      ]}
      pagination={false}
    />
  )
}
export default Table
