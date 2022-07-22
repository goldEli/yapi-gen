import { css } from '@emotion/css'
import styled from '@emotion/styled'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Popover,
  Collapse,
} from 'antd'
import IconFont from './IconFont'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment from 'moment'
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

  .ant-select-selection-placeholder {
    color: black;
    left: 65px;
  }

  .ant-select-selector {
    min-width: 186px;
  }
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
  basicsList?: any[]
  specialList?: any[]
  keys?: string[]
  onChangeForm?(value: any): void
  showForm?: boolean
}

const TableFilter = (props: Props) => {
  const [list, setList] = useState(props.list)
  const [basicsList, setBasicsList] = useState(props.basicsList)
  const [specialList, setSpecialList] = useState(props.specialList)
  const [form] = Form.useForm()
  const onClearForm = async () => {
    form.resetFields()
  }
  const filterBasicsList = useMemo(() => {
    const newKeys = list?.map(item => item.key)
    const arr = basicsList?.filter(item => !newKeys.includes(item.key))
    return arr
  }, [list, basicsList])
  const filterSpecialList = useMemo(() => {
    const newKeys = list?.map(item => item.key)
    const arr = specialList?.filter(item => !newKeys.includes(item.key))
    return arr
  }, [list, specialList])

  // console.log(dayjs())
  const content = (
    <div>
      <Input.Search />
      <div>
        <Collapse>
          <Collapse.Panel header="基础字段" key="1">
            {filterBasicsList?.map(i => <div key={i}>{i.name}</div>)}
          </Collapse.Panel>
          <Collapse.Panel header="人员和时间" key="2">
            {filterSpecialList?.map(i => <div key={i}>{i.name}</div>)}
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  )
  const delList = (key: string) => {
    setList(list.filter((item, idx) => item.key !== key))
  }
  const onChange: RangePickerProps['onChange'] = dates => {
    if (dates) {

      //
    } else {

      //
    }
  }
  const handleChange = (value: string[]) => {

    //
  }
  const confirm = async () => {
    const value = await form.validateFields()

    //
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
                      {i.children.map((v: any) => (
                        <Option key={v} value={v.name}>
                          {v.name}
                        </Option>
                      ))}
                    </SelectWrap>
                  </Form.Item>
                  <DelButton onClick={() => delList(i.key)}>
                    <IconFont type="close" style={{ fontSize: '12px' }} />
                  </DelButton>
                </SelectWrapBedeck>
              )
            }
            return (
              <SelectWrapBedeck key={i}>
                <Form.Item name="time">
                  <DatePicker.RangePicker
                    className={rangPicker}
                    getPopupContainer={node => node}
                    onChange={onChange}
                    ranges={{
                      最近一周: [
                        moment(new Date()).startOf('days')
                          .subtract(6, 'days'),
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
                  <IconFont type="close" style={{ fontSize: '12px' }} />
                </DelButton>
              </SelectWrapBedeck>
            )
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

export default TableFilter
