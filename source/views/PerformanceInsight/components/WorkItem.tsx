/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Select, Space } from 'antd'
import Detail from './Detail'
import DetailHeader from './DetailHeader'
import {
  TableStyle,
  Title,
  Text,
  FilterType,
  MainStyle,
  UserMsg,
  UserInfo,
} from './style'
import Table from './Table'
interface Props {
  visible: boolean
  id: number
  ids: number[]
  onCancel: () => void
}
interface UserInfo {
  user: {
    avatar: string
    name: string[]
  }
}
const Main = (props: UserInfo) => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'user',
    },
    {
      title: '标题',
      dataIndex: 'user',
      render: (text: string, record: { img: string }) => {
        return (
          <>
            <img src={record.img} />
            <span>{text}</span>
          </>
        )
      },
    },
  ]
  return (
    <MainStyle>
      <UserMsg>
        <CommonUserAvatar size="large" avatar={props.user.avatar} />
        <UserInfo>
          <div> 李四（xxxxxx@ifun.com）</div>
          <div className="msg">
            <Space size={4}>
              {props.user.name.map((el: string, index: number) => (
                <>
                  <span>{el}</span>
                  {index !== props.user.name.length - 1 && (
                    <CommonIconFont
                      type="right"
                      size={14}
                      color="var(--neutral-n3)"
                    />
                  )}
                </>
              ))}
            </Space>
          </div>
        </UserInfo>
      </UserMsg>
      <Title>待完成工作项：10项</Title>
      <FilterType>
        <Select
          style={{
            width: 184,
          }}
          placeholder={'筛选状态'}
          onChange={(newValue: any) => {
            console.log(newValue, 'newValue')
          }}
          suffixIcon={<CommonIconFont type="down" />}
          options={[{ label: '123', value: 99 }]}
          notFoundContent={null}
        />
        <Text>
          {/* 需要跳转到他的页面 概况待办 */}
          <span className="text">查看全部</span>
          <CommonIconFont
            type="right"
            size={16}
            color="var(--auxiliary-text-t2-d2)"
          />
        </Text>
      </FilterType>
      <TableStyle>
        <Table
          paginationShow={false}
          columns={columns}
          dataSource={[{ user: '123' }]}
          isSpinning={false}
          data={{
            currentPage: 2,
            total: 80,
            pageSize: 20,
          }}
          onChangePage={(pageNum, pageSize) =>
            console.log(pageNum, pageSize, 9898)
          }
        />
      </TableStyle>
    </MainStyle>
  )
}
const WorkItem = (props: Props) => {
  return (
    <>
      <Detail
        children={
          <>
            <DetailHeader ids={props.ids} onCancel={() => props.onCancel()} />
            <Main user={{ avatar: '', name: ['1', '2'] }} />
          </>
        }
        visible={props.visible}
      />
    </>
  )
}
export default WorkItem
