import styled from '@emotion/styled'
import { GENDER_MAP } from '@/constants'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import ResizeTable from '@/components/ResizeTable'
import NoData from '@/components/NoData'

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
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 160,
      render: (text: string, record: any) => (
        <CommonUserAvatar avatar={record.avatar} size="small" name={text} />
      ),
    },
    {
      title: '真实姓名',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (text: any, record: any) => GENDER_MAP[text],
    },
    {
      title: '邮箱',
      width: 160,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机',
      width: 160,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '部门',
      width: 160,
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: '职位',
      width: 160,
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: '团队角色',
      dataIndex: 'team_is_admin',
      key: 'team_is_admin',
      render: (text: any, record: any) =>
        text === 1 ? '团队管理' : '团队成员',
    },
    {
      title: '操作',
      dataIndex: 'action',
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
    <ResizeTable
      isSpinning={false}
      dataWrapNormalHeight="100%"
      col={columns}
      dataSource={props.dataSource}
      noData={<NoData />}
    />
  )
}
export default Table
