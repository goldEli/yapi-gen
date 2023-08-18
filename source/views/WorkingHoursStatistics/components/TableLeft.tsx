import ResizeTable from '@/components/ResizeTable'
import CommonUserAvatar from '@/components/CommonUserAvatar'
const colum = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 150,
    render: (text: any, record: any) => {
      return (
        <CommonUserAvatar
          size="large"
          avatar={''}
          name={text}
          positionName={'前端开发工程师'}
        />
      )
    },
  },
]
const TableLeft = (props: any) => {
  return (
    <ResizeTable
      isSpinning={false}
      dataWrapNormalHeight="calc(100% - 48px)"
      col={colum}
      dataSource={[{ name: 'zcm1' }, { name: 'zcm2' }, { name: 'zcm3' }]}
    />
  )
}
export default TableLeft
