import { Button, Dropdown, Menu } from 'antd'
import { ShapeContent } from '../Shape'
import { LevelContent } from '../Level'
import Pop from '../Popconfirm'

export const useDynamicColumns = (state: any) => {
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <Button onClick={state.showModal}>设置</Button>,
        },
      ]}
    />
  )

  return [
    {
      title: '1',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any, index: any) => {
        return (
          <div
            style={{
              visibility: index === state.rowActiveIndex ? 'visible' : 'hidden',
            }}
          >
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button>设置</Button>
            </Dropdown>
          </div>
        )
      },
    },
    {
      title: '2',
      dataIndex: 'age',
      key: 'age',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return <div onClick={() => state.showModal2(record)}>{text}</div>
      },
    },
    {
      title: '3',
      dataIndex: 'address',
      key: 'address',
      render: (text: any, record: any) => (
        <Pop
          content={({ onHide }) => (
            <ShapeContent hide={onHide} record={record}></ShapeContent>
          )}
          record={record}
        >
          123
        </Pop>
      ),
    },
    {
      title: '4',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: '5',
      dataIndex: 'address2',
      key: 'address2',
    },
    {
      title: '飞机',
      dataIndex: 'feiji',
      key: 'feiji',
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => (
        <Pop
          content={({ onHide }) => (
            <LevelContent hide={onHide} record={record}></LevelContent>
          )}
          record={record}
        >
          <Button>321</Button>
        </Pop>
      ),
    },
    {
      title: '大炮',
      dataIndex: 'dapao',
      key: 'dapao',
    },
    {
      title: '坦克',
      dataIndex: 'tanke',
      key: 'tanke',
    },
    {
      title: '直升机',
      dataIndex: 'zhishengji',
      key: 'zhishengji',
    },
    {
      title: '战舰',
      dataIndex: 'zhanjian',
      key: 'zhanjian',
    },
  ]
}
