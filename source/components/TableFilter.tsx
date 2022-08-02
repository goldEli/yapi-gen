/* eslint-disable complexity */
/* eslint-disable max-len */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Select, DatePicker, Button, Popover, Collapse } from 'antd'
import IconFont from './IconFont'
import moment from 'moment'
import { useMemo } from 'react'
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
const TimeWrap = styled(DatePicker.RangePicker)<{ label: string }>`
  &::before {
    content: '${({ label }) => label}';
    display: inline-block;
    white-space: nowrap;
    margin-right: 16px;
    margin-left: 10px;
  }
  .ant-picker-active-bar {
    visibility: hidden;
    /* left: 200px !important; */
  }
`
const SelectWrap = styled(Select)<{ label: string }>`
  & .ant-select-selector::before {
    content: '${({ label }) => label}';
    display: inline-block;
    margin-right: 16px;
    margin-left: 10px;
  }

  .ant-select-selection-placeholder {
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
    background-color: #2877ff;
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

const TableFilter = (props: any) => {
  const { list, basicsList, specialList } = props
  const [form] = Form.useForm()

  const filterBasicsList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = basicsList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, basicsList])

  const filterSpecialList = useMemo(() => {
    const newKeys = list?.map((item: { content: any }) => item.content)
    const arr = specialList?.filter(
      (item: any) => !newKeys.includes(item.content),
    )
    return arr
  }, [list, specialList])

  const delList = (key: string) => {
    props.onFilter(key, 0)

    // setList(list.filter((item, idx) => item.key !== key))
  }
  const addList = (key: string) => {
    props.onFilter(key, 1)
  }
  const confirm = async () => {
    const value = await form.getFieldsValue()
    const res = JSON.parse(JSON.stringify(value))
    for (const item in value) {
      if (item.includes('_at') && res[item]?.length === 2) {
        res[item][0] = moment(res[item][0]).unix()
          ? moment(res[item][0]).format('YYYY-MM-DD')
          : ''
        res[item][1]
          = moment(res[item][1]).unix() === 1893427200
            ? ''
            : moment(res[item][1]).format('YYYY-MM-DD')
      }
    }
    props.onSearch(res)
  }
  const onClearForm = async () => {
    form.resetFields()
    confirm()
  }
  const content = (
    <div>
      <div>
        <Collapse>
          <Collapse.Panel header="基础字段" key="1">
            {filterBasicsList
              ?.filter((k: any) => props.isIteration ? k.key !== 'iterate_name' : k)
              ?.map((i: any) => (
                <div onClick={() => addList(i.content)} key={i.id}>
                  {i.title}
                </div>
              ))}
          </Collapse.Panel>
          <Collapse.Panel header="人员和时间" key="2">
            {filterSpecialList?.map((i: any) => (
              <div onClick={() => addList(i.content)} key={i.id}>
                {i.title}
              </div>
            ))}
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  )

  return (
    <SearchLine>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          {list
            ?.filter((k: any) => props.isIteration ? k.key !== 'iterate_name' : k)
            ?.map((i: any) => {
              if (i.type === 'select') {
                return (
                  <SelectWrapBedeck key={i.key}>
                    <Form.Item name={i.key}>
                      <SelectWrap
                        label={i.name}
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请选择"
                        showSearch
                        onChange={confirm}
                      >
                        {i.children.map((v: any) => (
                          <Option key={v.id} value={v.id}>
                            {v.content}
                          </Option>
                        ))}
                      </SelectWrap>
                    </Form.Item>
                    <DelButton onClick={() => delList(i.content)}>
                      <IconFont type="close" style={{ fontSize: '12px' }} />
                    </DelButton>
                  </SelectWrapBedeck>
                )
              }
              return (
                <SelectWrapBedeck key={i.key}>
                  <Form.Item name={i.key}>
                    <TimeWrap
                      onChange={confirm}
                      label={i.name}
                      className={rangPicker}
                      getPopupContainer={node => node}
                      format={(times: moment.Moment) => {
                        if (times.unix() === 0 || times.unix() === 1893427200) {
                          return '空'
                        }
                        return times.format('YYYY-MM-DD')
                      }}
                      ranges={{
                        最近一周: [
                          moment(new Date())
                            .startOf('days')
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
                          moment(1893427200 * 1000),
                        ],
                        今天截止: [moment(0), moment(new Date()).endOf('days')],
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
        </FormWrap>
      </Wrap>
    </SearchLine>
  )
}

export default TableFilter
