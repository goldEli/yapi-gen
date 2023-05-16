import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { useEffect, useState } from 'react'
import Detail from './Detail'
import DetailHeader from './DetailHeader'
import {
  Line,
  ItemMain1,
  TypeBox,
  MainStyle,
  UserInfo,
  UserMsg,
  BtnStyle,
  WorkStyle,
  TitleType,
  ItemMain,
  RowItem,
  Row,
} from './style'
interface Props {
  ids: number[]
  visible: boolean
  id: number
}
interface UserInfo {
  user: {
    avatar: string
    name: string[]
  }
}
interface DataList {
  type: string
  isOpen: boolean
  list: Array<{
    title: string
    msg: string
    time: string
  }>
}
interface WorkType {
  data: Array<DataList>
}
interface Item {
  isOpen: boolean
  type: string
  list: Array<{
    title: string
    msg: string
    time: string
  }>
}
interface ItemMain1 {
  type: string
  list: Array<{
    title: string
    msg: string
    time: string
  }>
}
// 创建和分配
const Work = (props: WorkType) => {
  const { data } = props
  const [list, setList] = useState<Array<DataList>>([
    {
      type: '',
      isOpen: false,
      list: [],
    },
  ])
  useEffect(() => {
    setList(data.map((el: Item) => ({ ...el, isOpen: false })))
  }, [])
  const activeItem = (el: Item) => {
    setList(
      list.map((item: Item) => ({
        ...item,
        isOpen: el.type === item.type ? !item.isOpen : item.isOpen,
      })),
    )
  }
  return (
    <ItemMain>
      {list.map(el => (
        <WorkStyle key={el.type}>
          <TitleType onClick={() => activeItem(el)}>
            <span>{el.type}</span>
            <CommonIconFont
              type={el.isOpen ? 'up' : 'down'}
              size={16}
              color="var(--neutral-n2)"
            />
          </TitleType>
          {el.isOpen
            ? null
            : el.list.map(item => (
                <RowItem key={item.title}>
                  <Row>
                    <span className="title">{item.title}</span>
                    <span className="time">{item.time} 到期</span>
                  </Row>
                  <span className="msg">{item.msg}</span>
                </RowItem>
              ))}
        </WorkStyle>
      ))}
    </ItemMain>
  )
}
interface WorkRecordsTyle {
  list: Array<{ title: string; msg: string; time: string }>
  data: Array<ItemMain1>
}
// 工作记录
const WorkRecords = (props: WorkRecordsTyle) => {
  return (
    <>
      {props.list.map(item => (
        <RowItem key={item.title}>
          <Row>
            <span className="title">{item.title}</span>
            <span className="time">{item.time}</span>
          </Row>
          <span className="msg">{item.msg}</span>
        </RowItem>
      ))}
      <ItemMain1>
        {props.data.map(el => (
          <WorkStyle key={el.type}>
            <TypeBox>
              <Line />
              {el.type}
              <Line />
            </TypeBox>
            {el.list.map(item => (
              <RowItem key={item.title}>
                <Row>
                  <span className="title">{item.title}</span>
                  <span className="time">{item.time} 到期</span>
                </Row>
                <span className="msg">{item.msg}</span>
              </RowItem>
            ))}
          </WorkStyle>
        ))}
      </ItemMain1>
    </>
  )
}
const Main = (props: UserInfo) => {
  return (
    <>
      <MainStyle>
        <UserMsg>
          <CommonUserAvatar size="large" avatar={props.user.avatar} />
          <UserInfo>
            <div> 李四（xxxxxx@ifun.com）</div>
            <div className="msg">管理员</div>
          </UserInfo>
        </UserMsg>
        <BtnStyle
        // onClick={() => setIsVisible(true)}
        >
          <span className="text">分配事务</span>
        </BtnStyle>
      </MainStyle>
      {/* <Work data={[
                {
                    type: '进行中', isOpen: false, list: [{ title: '123', msg: '999', time: '2022-19-10' }
                    ]
                },
                {
                    type: '已逾期', isOpen: false, list: [{ title: '123', msg: '999', time: '2022-19-10' }
                    ]
                }
            ]} /> */}
      <WorkRecords
        data={[
          {
            type: '进行中',
            list: [{ title: '123', msg: '999', time: '2022-19-10' }],
          },
          {
            type: '已逾期',
            list: [{ title: '123', msg: '999', time: '2022-19-10' }],
          },
        ]}
        list={[
          { title: '123', msg: '999', time: '2022-19-10' },
          { title: '1235555555', msg: '995555559', time: '2022-19-10' },
        ]}
      />
    </>
  )
}
const SelectPersonnel = (props: Props) => {
  return (
    <Detail
      children={
        <>
          <DetailHeader ids={props.ids} />
          <Main user={{ avatar: '123', name: ['1'] }} />
        </>
      }
      visible={props.visible}
    />
  )
}
export default SelectPersonnel
