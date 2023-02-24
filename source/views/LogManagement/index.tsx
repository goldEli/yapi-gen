import ResizeTable from '@/components/ResizeTable'

const LogManagement = () => {
  // // table 数据
  // const dataSource = () => {
  //   const data = []
  //   for (let i = 0; i <= 20; i++) {
  //     data.push({
  //       key: i,
  //       name: '胡彦胡彦斌胡彦斌胡彦斌斌',
  //       age: 32,
  //       address: '西湖区湖底公园1号',
  //     })
  //   }
  //   return data
  // }
  return (
    <div>
      日志管理
      {/* <ResizeTable
        col={[
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            id: 0,
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            width: 100,
            id: 1,
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
            id: 2,
          },
        ]}
        dataSource={dataSource()}
        dataWrapNormalHeight="calc(100vh - 300px)"
      /> */}
    </div>
  )
}

export default LogManagement
