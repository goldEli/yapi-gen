import { Button, Dropdown, Menu } from 'antd'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import Pop from '@/components/Popconfirm'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { css } from '@emotion/css'

const flexCss = css`
  display: flex;
  align-items: center;
`
const StyledShape = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  text-align: center;
  border: 1px solid rgba(40, 119, 255, 1);
  color: rgba(40, 119, 255, 1);
`
const SetHead = styled.div`
  margin-left: 32px;
  margin-right: 12px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: rgba(40, 119, 255, 1);
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid rgba(40, 119, 255, 1);
  color: white;
`
const level = [
  {
    id: 1,
    name: '高',
    icon: <IconFont type="tall" style={{ color: '#ff5c5e', fontSize: 20 }} />,
  },
  {
    id: 2,
    name: '中',
    icon: <IconFont type="middle" style={{ color: '#fa9746', fontSize: 20 }} />,
  },
  {
    id: 3,
    name: '低',
    icon: <IconFont type="low" style={{ color: '#43ba9a', fontSize: 20 }} />,
  },
  {
    id: 4,
    name: '极低',
    icon: (
      <IconFont type="knockdown" style={{ color: '#bbbdbf', fontSize: 20 }} />
    ),
  },
]

export const useDynamicColumns = (state: any) => {
  return [
    {
      width: 200,
      align: 'center',
      title: '1',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any, index: any) => {
        const menu = (
          <Menu
            items={[
              {
                key: '1',
                label: (
                  <span
                    onClick={() => state.controlStaffPersonalVisible(record)}
                  >
                    设置
                  </span>
                ),
              },
              {
                key: '2',
                label: <span>编辑</span>,
              },
              {
                key: '3',
                label: <span>删除</span>,
              },
            ]}
          />
        )
        return (
          <div className={flexCss}>
            <div
              style={{
                visibility:
                  index === state.rowActiveIndex ? 'visible' : 'hidden',
              }}
            >
              <Dropdown overlay={menu} placement="bottomLeft">
                <IconFont
                  type="more
              "
                  style={{ color: 'rgba(40, 119, 255, 1)', fontSize: 20 }}
                />
              </Dropdown>
            </div>
            <SetHead>{text}</SetHead>
            <span>{text}</span>
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
      dataIndex: 'shape',
      key: 'address',
      render: (text: any, record: any) => (
        <Pop
          content={({ onHide }: { onHide: () => void }) => {
            return <ShapeContent hide={onHide} record={record}></ShapeContent>
          }}
          record={record}
        >
          <StyledShape>{text}</StyledShape>
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
      dataIndex: 'level',
      key: 'feiji',
      render: (
        text: string | number,
        record: Record<string, string | number>,
        index: number,
      ) => (
        <div className={flexCss}>
          <div className={flexCss}>
            {level.map(item => {
              if (text === item.id) {
                return (
                  <div className={flexCss} key={item.id}>
                    {item.icon}
                    <span style={{ margin: '0px 16px 0px 10px' }}>
                      {item.name}
                    </span>
                  </div>
                )
              }
            })}
          </div>
          <Pop
            content={({ onHide }: { onHide: () => void }) => (
              <LevelContent hide={onHide} record={record}></LevelContent>
            )}
            record={record}
          >
            <IconFont
              style={{
                visibility:
                  index === state.rowActiveIndex ? 'visible' : 'hidden',
                fontSize: 20,
              }}
              type="down-60kl9fcg"
            />
          </Pop>
        </div>
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
