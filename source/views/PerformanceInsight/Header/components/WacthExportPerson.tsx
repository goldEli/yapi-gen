import CommonModal from '@/components/CommonModal'
import { Table } from 'antd'
import { TableRow } from '../Style'
interface PropsType {
  title: string
  isVisible: boolean
  onConfirm: () => void
  onClose: () => void
  personData: Array<{
    name: string
    id?: number
  }>
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '部门',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '职务',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '电话',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '邮箱',
    dataIndex: 'address',
    key: 'address',
  },
]
const WacthExportPerson = (props: PropsType) => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ]
  return (
    <CommonModal
      width={784}
      isVisible={props.isVisible}
      title={props.title}
      onClose={() => props.onClose()}
      onConfirm={() => props.onConfirm()}
    >
      <TableRow>
        <Table pagination={false} dataSource={dataSource} columns={columns} />
      </TableRow>
    </CommonModal>
  )
}
export default WacthExportPerson
