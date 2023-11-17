import { useEffect, useState } from 'react'
import { TYPE_ENCEPHALOGRAM } from '@/constants'
import {
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
import { Checkbox, Popover, Space } from 'antd'
import IconFont from '@/components/IconFont'
import MoreSelect from '@/components/MoreSelect'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
const priorityList = [
  {
    label: '12',
    id:12,
    children: [
      {
        label: '规划中1',
        id: 2691,
      },
      {
        label: '规划中2',
        id: 2693,
      },
    ],
  },
  {
    label: '22',
    id:77,
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
  const [clickePerson, setClickePerson] = useState(true)
  const [state, setState] = useState([])
  const [date, setDate] = useState<any>(null)
  const [personData, setPersonData] = useState(priorityList)
  const value = [2691,2693]
  const onChangeSelect = () => {}
  useEffect(() => {
    const newChild = priorityList.map(el=>({
      ...el,
      checked:el.children.length === el.children.filter(item=> value.includes(item.id)).length,
      children:el.children.map(item=>({...item,checked:value.includes(item.id)}))}
      ))
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
  // 点击父级
  const onChangeF = (e:any, i:any) => {
    const newChild:any = personData.map((el:any)=>({
      ...el,
      checked:i.id === el.id ? e.target.checked : el.checked,
      children:i.id === el.id ? el.children.map((item:any)=>({...item,checked:e.target.checked})) : el.children}
    ))
    setPersonData(newChild)
  }
  // 点击子级
  const onChangeS=(e:any, i:any)=>{
    console.log(i.id)
    const Child:any = personData.map((el:any)=>({
      ...el,
      children: el.children.map((item:any)=>({...item,checked:i.id === item.id ? e.target.checked :item.checked}))}
    ))
    console.log(Child,'99')
    const newChild:any = Child.map((el:any)=>({
      ...el,
      checked: el.children.length === el.children.filter((item:any)=> item.checked).length
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
        <PersonMain>
          {personData.map((el:any) => (
            <>
              <RowTree key={el.label}>
                <div className="rowChild">
                  <Checkbox
                    checked={el.checked}
                    onChange={e => onChangeF(e, el)}
                  />
                  <TextTree>
                    {el.label}-{el.checked ? '1' : '0'}
                  </TextTree>
                </div>
                <IconFont
                  type="down"
                  style={{ color: 'var(--auxiliary-text-t2-d1)' }}
                />
              </RowTree>
              <div>
                {el.children.length >= 1 &&
                  el.children.map((item:any) => (
                    <RowTree key={item.label}>
                      <div className="rowChild">
                        <Checkbox  onChange={e => onChangeS(e, item)} checked={item.checked} />
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

  const onClickSearch = (value: any) => {
    console.log(value)
    setState(value || [])
  }
  const onChangeTime = (dates: any) => {
    if (dates) {
      const s = moment(dates[0]).format('YYYY-MM-DD') || ''
      const d = moment(dates[1]).format('YYYY-MM-DD') || ''
      setDate([s, d])
    } else {
      setDate(null)
    }
  }
  return (
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
            placeholder={'选择迭代'}
            showArrow
            showSearch
            getPopupContainer={(node: any) => node}
            allowClear
            optionFilterProp="label"
            onChange={onChangeSelect}
            options={[
              {
                label: 1,
                value: 1,
              },
            ]}
          />
          <MoreSelect
            showArrow
            mode="multiple"
            selectWidth={100}
            placeholder={'任务状态'}
            showSearch
            optionFilterProp="label"
            placement="bottomRight"
            width={200}
            allowClear
            options={priorityList}
            onChange={(value: any) => onClickSearch(value)}
            value={state}
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
  )
}

export default TopArea
