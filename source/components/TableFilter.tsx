import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Input, Select, DatePicker, Button, Popover, Space } from 'antd'
import IconFont from './IconFont'
import * as dayjs from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment, { Moment } from 'moment'
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
  display: 'flex',
  flexWrap: 'wrap',
  '.ant-form-item': {
    margin: 0,
  },
})

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 200px;
    border: none !important;
    outline: none !important;
  }
`

interface Props {
  keys?: string[]
  onChangeForm?(value: any): void
  showForm?: boolean
}

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
const SelectWrapBedeck = styled.div`
  margin-right: 16px;
  position: relative;
  /* width: 186px; */
  height: 32px;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  align-items: center;
  span {
    white-space: nowrap;
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
  right: -15px;
  top: -12px;
  width: 20px;
  height: 20px;
`
const list = [
  { name: '人员' },
  { name: '需求' },
  { name: '迭代' },
  { name: '时间' },
  { name: '状态' },
]

const timeList = [
  { name: '最近一周', type: '1' },
  { name: '最近一月', type: '2' },
  { name: '最近三月', type: '3' },
  { name: '今天开始', type: '4' },
  { name: '今天截止', type: '5' },
  { name: '时间为空', type: '6' },
]

export default (props: Props) => {
  const [form] = Form.useForm()
  const onClearForm = async () => {
    form.resetFields()
  }

  // console.log(dayjs())

  const content = (
    <div>
      <Input.Search />
      <div>
        {list.map(i => (
          <div key={i.name}>{i.name}</div>
        ))}
      </div>
    </div>
  )

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
    <Wrap hidden={props.showForm}>
      <FormWrap form={form}>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '12px' }}>迭代</span>
          <Form.Item name="tall">
            <SelectWrap
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="所有"
              showSearch
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled">Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </SelectWrap>
          </Form.Item>
          <DelButton>×</DelButton>
        </SelectWrapBedeck>

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
                moment(new Date()).startOf('months').subtract(1, 'months'),
                moment(new Date()).endOf('days'),
              ],
              最近三月: [
                moment(new Date()).startOf('months').subtract(3, 'months'),
                moment(new Date()).endOf('days'),
              ],
              今天开始: [moment(new Date()).startOf('days'), moment.min()],
              今天截止: [moment.max(), moment(new Date()).endOf('days')],
            }}
          />
        </Form.Item>
        <Form.Item>
          <Popover placement="bottom" content={content} trigger={['click']}>
            <Button icon={<IconFont type="plus" />} />
          </Popover>
        </Form.Item>
      </FormWrap>
      <ClearForm onClick={onClearForm}>清除条件</ClearForm>
      <Button onClick={confirm}>搜索</Button>
    </Wrap>
  )
}
