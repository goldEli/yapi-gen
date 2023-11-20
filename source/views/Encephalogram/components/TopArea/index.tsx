import { useEffect, useState } from 'react'
import { TYPE_ENCEPHALOGRAM } from '@/constants'
import {
  TopAreaWrap,
  TopAreaBox,
  TypeBox,
  Row,
  Bgc,
  Text,
  TypeSelectBox,
  PopoverBtn,
  Content,
  HeaderPopover,
  MianHeader,
  Title,
  Msg,
  HeaderMsg,
  Type,
  CenterWrap,
  TimeWrap,
  TextWrap,
  CustomSelectWrap,
  RangePickerWrap,
  PersonMain,
  RowTree,
  TextTree,
} from '@/views/Encephalogram/styles'
import { Checkbox, Input, Popover, Space } from 'antd'
import IconFont from '@/components/IconFont'
import MoreSelect from '@/components/MoreSelect'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { useDispatch } from 'react-redux'
import { setEncephalogramParmas } from '@store/encephalogram'
import { useSelector } from '@store/index'
import { getIterateList } from '@/services/iterate'
const priorityList1 = [
  {
    label: '12',
    id: 12,
    children: [
      {
        label: '规划中1',
        id: 2691,
      },
      {
        label: '规划中2',
        id: 2693,
      },
      {
        label: '规划中23',
        id: 2694,
      },
    ],
  },
  {
    label: '22',
    id: 77,
    children: [
      {
        label: '规划中14',
        id: 26922,
      },
    ],
  },
]
const TopArea = () => {
  const [clickeMsg, setClickeMsg] = useState(false)
  const [clickePerson, setClickePerson] = useState(false)
  const [date, setDate] = useState<any>(null)
  const [personData, setPersonData] = useState(priorityList1)
  const value: any = []
  const [personVal, setPersonVal] = useState(value)
  const [search, setSearch] = useState('')
  const [length, setLength] = useState(0)
  const dispatch = useDispatch()
  // 状态的
  const [priorityList, setPriorityList] = useState()
  // 迭代的
  const [interateList, setInterateList] = useState()
  const { projectInfoValues, projectInfo } = useSelector(store => store.project)
  useEffect(() => {
    // 状态的
    const list = projectInfoValues
      .find(item => item.key === 'status')
      ?.children?.filter((l: any) => l.id > 0)
    const newData = list?.map((v: { name: any; statuss: any[] }) => ({
      label: v.name,
      children: v?.statuss?.map((val: any) => ({
        label: val.content_txt || val.content,
        value: val?.pivot?.id,
        id: val?.pivot?.id,
      })),
    }))
    setPriorityList(newData)
  }, [projectInfoValues])
  const getInterateList = async () => {
    // 获取迭代下拉数据
    const response = await getIterateList({
      projectId: projectInfo.id,
    })
    setInterateList(
      response?.list?.map((i: any) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }
  useEffect(() => {
    // 迭代下拉
    getInterateList()
    // 组装项目成员的数据
    const newChild = priorityList1.map(el => ({
      ...el,
      fold: true,
      len: el.children.length,
      checked:
        el.children.length ===
        el.children.filter(item => value.includes(item.id)).length,
      children: el.children.map(item => ({
        ...item,
        checked: value.includes(item.id),
      })),
    }))
    let len = 0
    newChild.forEach(el => {
      len += el.len
    })
    setLength(len)
    setPersonVal([...value])
    setPersonData(newChild)
  }, [])
  const content = () => {
    return (
      <Content>
        <HeaderPopover>
          <span>项目介绍</span>
          <IconFont
            onClick={() => setClickeMsg(false)}
            type="close"
            style={{ color: 'var(--neutral-n2)' }}
          />
        </HeaderPopover>
        <MianHeader>
          <div className="leftWrap">
            <img src="" />
            <HeaderMsg>
              <Title>title</Title>
              <Msg>11</Msg>
            </HeaderMsg>
          </div>
          <Type color="#43BA9A" bgc="rgba(67,186,154,0.1)">
            <div className="border" />
            <div>进行中</div>
          </Type>
        </MianHeader>
        <CenterWrap>
          <div className="col">
            <span>21</span>
            <span>2</span>
          </div>
          <div className="col">
            <span>12</span>
            <span>2</span>
          </div>
          <div className="col">
            <span>11</span>
            <span>2</span>
          </div>
        </CenterWrap>
        <TimeWrap>
          <Row className="timeRow">
            <span>开始时间：</span>
            <span>2</span>
          </Row>
          <Row className="timeRow">
            <span>预计结束：</span>
            <span>2</span>
          </Row>
        </TimeWrap>
        <TextWrap>
          我是测结婚dsksk肯定萨克成都市监考老师我是测结婚dsksk肯定萨克成都市监考老师我是测结婚dsksk肯定萨克成都市监考老师我是测结婚dsksk肯定萨克成都市监考老师我是测结婚dsksk肯定萨克成都市监考老师
        </TextWrap>
      </Content>
    )
  }
  // 点击父级，设置勾选获取value
  const onChangeF = (e: any, i: any) => {
    const newChild: any = personData.map((el: any) => ({
      ...el,
      checked: i.id === el.id ? e.target.checked : el.checked,
      children:
        i.id === el.id
          ? el.children.map((item: any) => ({
              ...item,
              checked: e.target.checked,
            }))
          : el.children,
    }))
    // 重装数据
    setPersonData(newChild)
    let newVal: any = []
    newVal = i.children.map((el: any) => el.id)
    // 组value
    if (e.target.checked) {
      setPersonVal([...personVal, ...newVal])
      dispatch(
        setEncephalogramParmas({
          person: [...personVal, ...newVal]
        }),
      )
    } else {
      setPersonVal(personVal.filter((el: any) => !newVal?.includes(el)))
      dispatch(
        setEncephalogramParmas({
          person: personVal.filter((el: any) => !newVal?.includes(el))
        }),
      )
    }
  }
  // 点击子级,设置勾选获取value
  const onChangeS = (e: any, i: any) => {
    const Child: any = personData.map((el: any) => ({
      ...el,
      children: el.children.map((item: any) => ({
        ...item,
        checked: i.id === item.id ? e.target.checked : item.checked,
      })),
    }))
    const newChild: any = Child.map((el: any) => ({
      ...el,
      checked:
        el.children.length ===
        el.children.filter((item: any) => item.checked).length,
    }))
    setPersonData(newChild)
    // 组value
    if (e.target.checked) {
      setPersonVal([...personVal, i.id])
      dispatch(setEncephalogramParmas({
        person: [...personVal, i.id]
      }))
    } else {
      setPersonVal(personVal.filter((el: any) => el !== i.id))
      dispatch(setEncephalogramParmas({
        person: personVal.filter((el: any) => el !== i.id)
      }))
    }
  }
  // 折叠
  const foldIcon = (e: { id: number; fold: boolean }) => {
    setPersonData(
      personData.map((el: any) => ({
        ...el,
        fold: el.id === e.id ? !el.fold : el.fold,
      })),
    )
  }
  // 人员搜索
  const onInput = (e: any) => {
    const str: string = e.target.value
    setPersonVal([])
    if (!str) {
      reset()
      return
    }
    setSearch(str)
    const newData: {
      label: string
      id: number
      fold: boolean
      len: number
      checked: boolean
      children: { label: string; id: number; fold: boolean; checked: boolean }[]
    }[] = []
    personData.forEach((el: any) => {
      if (
        el.children.filter((item: { label: string | string[] }) =>
          item.label.includes(str),
        )?.length >= 1
      ) {
        newData.push({
          id: el.id,
          label: el.label,
          fold: false,
          len: el.len,
          checked: el.checked,
          children: el.children.filter((item: { label: string | string[] }) =>
            item.label.includes(str),
          ),
        })
      }
    })
    setPersonData(newData)
  }
  // 重置
  const reset = () => {
    setSearch('')
    setPersonVal([])
    const newChild = priorityList1.map(el => ({
      ...el,
      fold: true,
      len: el.children.length,
      checked: false,
      children: el.children.map(item => ({
        ...item,
        checked: false,
      })),
    }))
    setPersonData(newChild)
  }
  const contentPerson = () => {
    return (
      <Content>
        <HeaderPopover>
          <span>项目人员</span>
          <IconFont
            onClick={() => setClickePerson(false)}
            type="close"
            style={{ color: 'var(--neutral-n2)' }}
          />
        </HeaderPopover>
        <Input
          value={search}
          placeholder="搜索成员姓名"
          onInput={(e: any) => onInput(e)}
        />
        <Row>
          <div className="text">
            <span>已选</span>
            <span>
              （{personVal.length || 0}/{length}）
            </span>
          </div>
          <div className="text" onClick={reset}>
            重置
          </div>
        </Row>
        <PersonMain>
          {personData.map((el: any) => (
            <>
              <RowTree key={el.label}>
                <div className="rowChild">
                  <Checkbox
                    checked={el.checked}
                    onChange={e => onChangeF(e, el)}
                  />
                  <TextTree>{el.label}</TextTree>
                </div>
                <IconFont
                  onClick={() => foldIcon(el)}
                  type={el.fold ? 'up' : 'down'}
                  style={{ color: 'var(--auxiliary-text-t2-d1)' }}
                />
              </RowTree>
              <div
                style={{
                  display: el.fold ? 'none' : 'block',
                  transition: 'all 0.5s',
                }}
              >
                {el.children?.length >= 1 &&
                  el.children?.map((item: any) => (
                    <RowTree key={item.label}>
                      <div className="rowChild">
                        <Checkbox
                          onChange={e => onChangeS(e, item)}
                          checked={item.checked}
                        />
                        <img src="" />
                        <TextTree>{item.label}</TextTree>
                      </div>
                    </RowTree>
                  ))}
              </div>
            </>
          ))}
        </PersonMain>
      </Content>
    )
  }
  // 选中任务状态
  const onClickSearch = (value: Array<number>) => {
    dispatch(
      setEncephalogramParmas({
        state: value || [],
      }),
    )
  }
  // 选中迭代
  const onChangeSelect = (value: Array<number>) => {
    dispatch(
      setEncephalogramParmas({
        iterationVal: value || [],
      }),
    )
  }
  // 时间选择
  const onChangeTime = (dates: any) => {
    if (dates) {
      const s = moment(dates[0]).format('YYYY-MM-DD') || ''
      const d = moment(dates[1]).format('YYYY-MM-DD') || ''
      setDate([s, d])
      dispatch(
        setEncephalogramParmas({
          time: [s, d],
        }),
      )
    } else {
      setDate(null)
      dispatch(
        setEncephalogramParmas({
          time: [],
        }),
      )
    }
  }

  return (
    <TopAreaWrap>
      <MyBreadcrumb />
      <TopAreaBox>
        <TypeBox>
          {TYPE_ENCEPHALOGRAM.map(el => (
            <Row key={el.color}>
              <Bgc color={el.color} />
              <Text>{el.text}</Text>
            </Row>
          ))}
        </TypeBox>
        <TypeSelectBox className="selectBgc">
          <Space size={20}>
            <CustomSelectWrap
              mode="multiple"
              placeholder="选择迭代"
              showArrow
              showSearch
              getPopupContainer={(node: any) => node}
              allowClear
              optionFilterProp="label"
              onChange={onChangeSelect}
              options={interateList}
            />
            <MoreSelect
              showArrow
              mode="multiple"
              selectWidth={100}
              placeholder="任务状态"
              showSearch
              optionFilterProp="label"
              placement="bottomRight"
              width={200}
              allowClear
              options={priorityList}
              onChange={(value: any) => onClickSearch(value)}
            />
            <RangePickerWrap type={date?.length >= 1}>
              <RangePicker
                isShowQuick
                placement="bottomRight"
                onChange={dates => onChangeTime(dates)}
              />
              {date?.length >= 1 ? (
                <span className="timeText">
                  {date[0]}~{date[1]}
                </span>
              ) : (
                <span className="timeText">时间</span>
              )}
            </RangePickerWrap>
            <Popover
              onOpenChange={(val: boolean) => setClickeMsg(val)}
              getPopupContainer={node => node}
              content={content}
              trigger="click"
              open={clickeMsg}
            >
              <PopoverBtn onClick={() => setClickeMsg(!clickeMsg)}>
                <IconFont type="intro" />
                <span>项目简介</span>
              </PopoverBtn>
            </Popover>
            <Popover
              onOpenChange={(val: boolean) => setClickePerson(val)}
              getPopupContainer={node => node}
              content={contentPerson}
              trigger="click"
              open={clickePerson}
            >
              <PopoverBtn onClick={() => setClickePerson(!clickePerson)}>
                <IconFont type="intro" />
                <span>项目人员</span>
              </PopoverBtn>
            </Popover>
          </Space>
        </TypeSelectBox>
      </TopAreaBox>
    </TopAreaWrap>
  )
}

export default TopArea
