import { useState } from 'react'
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
} from '@/views/Encephalogram/styles'
import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'
import { Popover, Space } from 'antd'
import IconFont from '@/components/IconFont'
import MoreSelect from '@/components/MoreSelect'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
const CustomSelectWrap = styled(CustomSelect)`
  min-width: 100px;
`
const RangePickerWrap = styled.div<{ type: boolean }>(
  {
    height: '32px',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '6px',
    color: 'var(--auxiliary-text-t2-d1)',
    '.ant-picker': {
      position: 'absolute',
      left: '0px',
      background: 'transparent',
      zIndex: 88,
    },
    '.timeText':{
      position: 'relative',
      right: '-20px',
      background: 'transparent',
      zIndex: 8
    },
    '&:hover': {
      color: 'var(--auxiliary-text-t2-d2)',
      '.ant-picker-suffix':{
        color: 'var(--auxiliary-text-t2-d2)',
      },
      cursor: 'pointer'
    }
  },
  ({ type }) => ({
    '.timeText':{
      width: type ? '190px' : '52px',
      color: type ? 'var(--auxiliary-text-t2-d2)':'var(--auxiliary-text-t2-d1)'
    },
    '.ant-picker .ant-picker-suffix':{
      color: type ? 'var(--auxiliary-text-t2-d2)':'var(--auxiliary-text-t2-d1)'
    },
    '.ant-picker-clear':{
      background: 'transparent',
    },
    backgroundColor:type? 'var(--function-tag5)': 'var(--auxiliary-b4)',
  }),
)

const TopArea = () => {
  const [clicked, setClicked] = useState(false)
  const [state, setState] = useState([])
  const [date, setDate] = useState<any>(null)
  const onChangeSelect = () => {}
  const handleClickChange = (open: boolean) => {
    setClicked(open)
  }
  const content = () => {
    return (
      <Content>
        <HeaderPopover>
          <span>项目介绍</span>
          <IconFont
            onClick={() => setClicked(false)}
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
  const priorityList = [
    {
      label: '12',
      children: [
        {
          label: '规划中',
          value: 2692,
          id: 2692,
        },
      ],
    },
    {
      label: '22',
      children: [
        {
          label: '规划中1',
          value: 26922,
          id: 26922,
        },
      ],
    },
  ]
  const onClickSearch = (value: any) => {
    console.log(value)
    setState(value || [])
  }
  const onChangeTime = (dates: any) => {
    if (dates) {
      const s = moment(dates[0]).format('YYYY-MM-DD') || ''
      const d = moment(dates[1]).format('YYYY-MM-DD') || ''
      setDate([s, d])
    }else{
      // setDate(null)
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
          <Popover
            onOpenChange={handleClickChange}
            getPopupContainer={node => node}
            content={content}
            trigger="click"
            open={clicked}
          >
            <PopoverBtn onClick={() => setClicked(!clicked)}>
              <IconFont type="intro" />
              <span>项目简介</span>
            </PopoverBtn>
          </Popover>
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
        </Space>
      </TypeSelectBox>
    </TopAreaBox>
  )
}

export default TopArea
