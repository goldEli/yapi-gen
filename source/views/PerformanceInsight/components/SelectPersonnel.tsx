import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { useEffect, useState } from 'react'
import Detail from './Detail'
import DetailHeader from './DetailHeader'
import {
  Line,
  ItemMain1,
  TypeBox,
  MainStyle1,
  UserInfo,
  UserMsg,
  BtnStyle,
  WorkStyle,
  TitleType,
  ItemMain,
  RowItem,
  Row,
  MainWrap,
  Item,
} from './style'
interface Props {
  ids: number[]
  visible: boolean
  id: number
  onCancel: () => void
  type: string
}
interface UserInfo {
  type: string
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
  const [type, setType] = useState<number>(0)
  const onChangeIdx = (num: number) => {
    setType(num)
  }
  return (
    <>
      <MainStyle1>
        <UserMsg>
          <CommonUserAvatar size="large" avatar={props.user.avatar} />
          <UserInfo>
            <div> 李四（xxxxxx@ifun.com）</div>
            <div className="msg">管理员1</div>
          </UserInfo>
        </UserMsg>
        {props.type}

        <BtnStyle
        // onClick={() => setIsVisible(true)}
        >
          {/* 快捷操作，打开创建事务的弹窗 */}
          {(props.type === 'Progress_iteration' ||
            props.type === 'Progress_sprint' ||
            props.type === 'Defect_iteration' ||
            props.type === 'Defect_sprint') && (
            <span className="text">分配事务</span>
          )}
        </BtnStyle>
      </MainStyle1>
      <MainWrap size={32}>
        <Item onClick={() => onChangeIdx(0)} activeIdx={type === 0}>
          <span>工作记录</span>
        </Item>
        {/* // 进展对比 Progress_iteration-迭代 Progress_sprint冲刺 Progress_all全局
       //缺陷 Defect_iteration-迭代 Defect1冲刺 DefectAll全局 */}
        {props.type === 'Progress_iteration' ||
        props.type === 'Progress_sprint' ||
        props.type === 'Progress_all' ? (
          <>
            <Item onClick={() => onChangeIdx(1)} activeIdx={type === 1}>
              <span>他创建的事务</span>
            </Item>
            <Item onClick={() => onChangeIdx(2)} activeIdx={type === 2}>
              <span>分配给他的事务</span>
            </Item>
          </>
        ) : (
          <Item onClick={() => onChangeIdx(2)} activeIdx={type === 2}>
            <span>分配给他的缺陷</span>
          </Item>
        )}
      </MainWrap>
      {type === 0 ? (
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
      ) : (
        <Work
          data={[
            {
              type: '进行中',
              isOpen: false,
              list: [{ title: '123', msg: '999', time: '2022-19-10' }],
            },
            {
              type: '已逾期',
              isOpen: false,
              list: [{ title: '123', msg: '999', time: '2022-19-10' }],
            },
          ]}
        />
      )}
    </>
  )
}
const SelectPersonnel = (props: Props) => {
  return (
    <Detail
      children={
        <>
          <DetailHeader ids={props.ids} onCancel={() => props.onCancel()} />
          <Main type={props.type} user={{ avatar: '123', name: ['1'] }} />
        </>
      }
      visible={props.visible}
    />
  )
}
export default SelectPersonnel
