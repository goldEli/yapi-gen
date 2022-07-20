import { css } from '@emotion/css'
import styled from '@emotion/styled'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Popover,
  Space,
  Tree,
} from 'antd'
import IconFont from './IconFont'
import * as dayjs from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment, { Moment } from 'moment'
import { DataNode } from 'antd/lib/tree'
import { useMemo, useState } from 'react'
import { SearchLine } from './StyleCommon'
const { Option } = Select
const Wrap = styled.div({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
})

const ClearForm = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginLeft: 16,
})

const FormWrap = styled(Form)({
  gap: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  '.ant-form-item': {
    margin: 0,
  },
})

const SelectWrap = styled(Select)<{ label: string }>`
  & .ant-select-selector::before {
    content: '${({ label }) => label}';
    display: inline-block;
    margin-right: 16px;
    margin-left: 10px;
  }
  /* padding-left: 56px; */
  .ant-select-selection-placeholder {
    color: black;
    left: 65px;
  }

  .ant-select-selector {
    min-width: 186px;
  }
  /* .ant-select-selection-overflow {
    padding-left: 45px;
  } */
`
const rangPicker = css`
  .ant-picker-panel-container {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-picker-footer {
    min-width: inherit;
    width: max-content;
  }
  .ant-picker-ranges {
    display: flex;
    flex-direction: column;
  }
  .ant-tag {
    margin-right: 0;
  }
`
const DelButton = styled.div`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #9b9daa;
  position: absolute;
  right: -7px;
  top: -7px;
  width: 15px;
  height: 15px;
  visibility: hidden;
  &:hover {
    background-color: blue;
  }
`
const SelectWrapBedeck = styled.div`
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
  span {
    white-space: nowrap;
  }
  &:hover ${DelButton.toString()} {
    visibility: visible;
  }
`
interface Props {
  list: any[]
  allList?: any[]
  keys?: string[]
  onChangeForm?(value: any): void
  showForm?: boolean
}
export default (props: Props) => {
  const [list, setList] = useState(props.list)
  const [allList, setAllList] = useState(props.allList)
  const [form] = Form.useForm()
  const onClearForm = async () => {
    form.resetFields()
  }
  const filterList = useMemo(() => {
    let newKeys = list?.map(item => item.key)
    const arr = allList?.filter(item => !newKeys.includes(item.key))
    return arr
  }, [list, allList])
  // console.log(dayjs())
  const content = (
    <div>
      <Input.Search />
      <div>
        {filterList?.map(i => (
          <div>{i.name}</div>
        ))}
      </div>
    </div>
  )
  const delList = (key: string) => {
    setList(list.filter((item, idx) => item.key !== key))
  }
  const onChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      console.log(dayjs().startOf('week'))
    } else {
      console.log('Clear')
    }
  }
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }
  const confirm = async () => {
    const value = await form.validateFields()
    console.log(value)
  }
  return (
    <SearchLine>
       <Wrap hidden={props.showForm}>
      <FormWrap form={form}>
        {list?.map((i, index) => {
          if (i.type === 'select') {
            return (
              <SelectWrapBedeck>
                <Form.Item name={i.key}>
                  <SelectWrap
                    label={i.name}
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="所有"
                    showSearch
                  >
                    {i.children.map(v => (
                      <Option value={v.name}>{v.name}</Option>
                    ))}
                  </SelectWrap>
                </Form.Item>
                <DelButton onClick={() => delList(i.key)}>
                  <IconFont
                    type="close"
                    style={{ fontSize: '12px' }}
                  ></IconFont>
                </DelButton>
              </SelectWrapBedeck>
            )
          } else {
            return (
              <SelectWrapBedeck>
                <Form.Item name="time">
                  <DatePicker.RangePicker
                    className={rangPicker}
                    getPopupContainer={node => node}
                    onChange={onChange}
                    ranges={{
                      最近一周: [
                        moment(new Date()).startOf('days').subtract(6, 'days'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近一月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(1, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近三月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(3, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      今天开始: [
                        moment(new Date()).startOf('days'),
                        moment.min(),
                      ],
                      今天截止: [
                        moment.max(),
                        moment(new Date()).endOf('days'),
                      ],
                    }}
                  />
                </Form.Item>
                <DelButton onClick={() => delList(i.key)}>
                  <IconFont
                    type="close"
                    style={{ fontSize: '12px' }}
                  ></IconFont>
                </DelButton>
              </SelectWrapBedeck>
            )
          }
        })}

        <Popover placement="bottom" content={content} trigger={['click']}>
          <Button icon={<IconFont type="plus" />} />
        </Popover>
        <ClearForm onClick={onClearForm}>清除条件</ClearForm>
        <Button onClick={confirm}>搜索</Button>
      </FormWrap>
    </Wrap>
    </SearchLine>
   
  )
}
