/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Select, Space } from 'antd'
import { useState } from 'react'
import Detail from './Detail'

import {
  TableStyle,
  Title,
  Text,
  FilterType,
  HeaderStyle,
  BackIcon,
  ChangeIconGroup,
  UpWrap,
  DownWrap,
  MainStyle,
  UserMsg,
  UserInfo,
} from './style'
import Table from './Table'
interface Props {
  visible: boolean
  id: number
  ids: number[]
}
const Header = (props: { ids: number[] }) => {
  const [currentIndex, setCurrentIndex] = useState(4)
  const onCancel = () => {
    // 获取当前需求的下标， 用作上一下一切换
    //  setCurrentIndex((ids || []).findIndex((i: any) => i === info.id))
  }
  return (
    <HeaderStyle>
      <Space size={16}>
        <BackIcon onClick={onCancel}>
          <CommonIconFont type="right-02" size={20} color="var(--neutral-n2)" />
        </BackIcon>
      </Space>
      <Space size={16}>
        <ChangeIconGroup>
          {currentIndex > 0 && (
            <UpWrap
              // onClick={onUpDemand}
              id="upIcon"
              isOnly={
                props.ids?.length === 0 ||
                currentIndex === props.ids?.length - 1
              }
            >
              <CommonIconFont
                type="up"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </UpWrap>
          )}
          {!(
            props.ids?.length === 0 || currentIndex === props.ids?.length - 1
          ) && (
            <DownWrap
              //   onClick={onDownDemand}
              id="downIcon"
              isOnly={currentIndex <= 0}
            >
              <CommonIconFont
                type="down"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </DownWrap>
          )}
        </ChangeIconGroup>
      </Space>
    </HeaderStyle>
  )
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
      <Title>待完成工作项：10项</Title>
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
            <Header ids={props.ids} />
            <Main user={{ avatar: '', name: ['1', '2'] }} />
          </>
        }
        visible={props.visible}
      />
    </>
  )
}
export default WorkItem
