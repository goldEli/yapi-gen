import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { getParamsData } from '@/tools'
import { useDispatch } from '@store/index'
import { setAddWorkItemModal } from '@store/project'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  visible: boolean
  type: string
  ids: number[]
  historyWorkObj: API.Efficiency.HistoryWorkList.Result | undefined
  onPageNum: (id: number) => void
  onCancel: () => void
  onChange: (value: API.Sprint.EfficiencyMemberWorkList.Params) => void
}
interface UserInfo {
  type: string
  user: {
    avatar: string
    name: string[]
  }
  historyWorkObj: API.Efficiency.HistoryWorkList.Result | undefined
}

interface WorkType {
  historyWorkObj: API.Efficiency.HistoryWorkList.Result | undefined
  type: number
}

// 创建和分配事务组件
const Work = (props: WorkType) => {
  const [list, setList] = useState<
    Array<Models.Efficiency.CreatedWord> | undefined
  >([])
  const activeItem = (el: Models.Efficiency.CreatedWord) => {
    setList(
      list?.map((item: Models.Efficiency.CreatedWord) => ({
        ...item,
        isOpen:
          el.status_name === item.status_name ? !item.isOpen : item.isOpen,
      })),
    )
  }
  useEffect(() => {
    if (props.type === 1) {
      setList(
        props.historyWorkObj?.created_work.map(el => ({
          ...el,
          isOpen: false,
        })),
      )
    } else if (props.type === 2) {
      setList(
        props.historyWorkObj?.work?.map(el => ({
          ...el,
          isOpen: false,
        })),
      )
    }
  }, [props.type])
  return (
    <ItemMain>
      {list?.map(el => (
        <WorkStyle key={el.status_name}>
          <TitleType onClick={() => activeItem(el)}>
            <span>{el.status_name}</span>
            <CommonIconFont
              type={el.isOpen ? 'up' : 'down'}
              size={16}
              color="var(--neutral-n2)"
            />
          </TitleType>
          {el.isOpen
            ? null
            : el.list.map(item => (
                <RowItem key={item.name}>
                  <Row>
                    <span className="title">
                      {item.parent_name ? item.parent_name : '--'}
                    </span>
                    <span className="time">{item.expected_end_at} 到期</span>
                  </Row>
                  <span className="msg">{item.name}</span>
                </RowItem>
              ))}
        </WorkStyle>
      ))}
    </ItemMain>
  )
}
interface WorkRecordsTyle {
  list: Array<Models.Efficiency.WorkRecord>
}
// 工作记录
const WorkRecords = (props: WorkRecordsTyle) => {
  const { list } = props
  return (
    <ItemMain>
      {list?.map(el => (
        <WorkStyle key={el.date}>
          {el.list.map(item => (
            <RowItem key={item.name + item.created_at}>
              <Row>
                <span className="title">{item.name}</span>
                <span className="time">{item.created_at}</span>
              </Row>
              <span className="msg">
                状态由【{item.status_from.content}】更改为【
                {item.status_to.content}】
              </span>
            </RowItem>
          ))}
          <TypeBox>
            <Line />
            {el.date}
            <Line />
          </TypeBox>
        </WorkStyle>
      ))}
    </ItemMain>
  )
}
const Main = (props: UserInfo) => {
  // console.log(props, '00')
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
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
            <div>
              {' '}
              {props.historyWorkObj?.name}（{props.historyWorkObj?.email}）
            </div>
            <div className="msg">{props.historyWorkObj?.role.name}</div>
          </UserInfo>
        </UserMsg>
        {(props.type === 'Progress_iteration' ||
          props.type === 'Progress_sprint' ||
          props.type === 'Defect_iteration' ||
          props.type === 'Defect_sprint') && (
          <BtnStyle
            onClick={() =>
              dispatch(
                setAddWorkItemModal({
                  visible: true,
                  params: {
                    projectId: paramsData.projectId,
                    type: 7,
                    title: '创建事务',
                  },
                }),
              )
            }
          >
            {/* 快捷操作，打开创建事务的弹窗 */}
            <span className="text">分配事务</span>
          </BtnStyle>
        )}
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
        <WorkRecords list={props.historyWorkObj?.work_record || []} />
      ) : (
        <Work type={type} historyWorkObj={props.historyWorkObj} />
      )}
    </>
  )
}
const SelectPersonnel = (props: Props) => {
  return (
    <Detail
      children={
        <>
          <DetailHeader
            ids={props.ids}
            onCancel={() => props.onCancel()}
            infoId={props.historyWorkObj?.id || 0}
            onPageNum={props.onPageNum}
          />
          <Main
            type={props.type}
            historyWorkObj={props.historyWorkObj}
            user={{ avatar: '123', name: ['1'] }}
          />
        </>
      }
      visible={props.visible}
    />
  )
}
export default SelectPersonnel
