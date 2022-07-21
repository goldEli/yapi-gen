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
  Collapse,
} from 'antd'

import * as dayjs from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker'
import moment, { Moment } from 'moment'
import { DataNode } from 'antd/lib/tree'
import { useMemo, useState } from 'react'
import { SearchLine } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'

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
  onChangeForm?(value: any): void
  showForm?: boolean
  onSearch(value: any): void
}
export default (props: Props) => {
  const [form] = Form.useForm()
  const onClearForm = async () => {
    form.resetFields()
  }

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }
  const confirm = async () => {
    const value = await form.validateFields()

    props.onSearch(value)
  }
  return (
    <SearchLine>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          <SelectWrapBedeck>
            <Form.Item name="name">
              <SelectWrap
                label="部门"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                <Option value={1}>haha</Option>
                <Option value={2}>haha</Option>
                <Option value={3}>haha</Option>
                <Option value={4}>haha</Option>
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <Form.Item name="age">
              <SelectWrap
                label="职位"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                <Option value={1}>haha</Option>
                <Option value={2}>haha</Option>
                <Option value={3}>haha</Option>
                <Option value={4}>haha</Option>
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <Form.Item name="tall">
              <SelectWrap
                label="权限组"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                <Option value={1}>haha</Option>
                <Option value={2}>haha</Option>
                <Option value={3}>haha</Option>
                <Option value={4}>haha</Option>
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>

          <ClearForm onClick={onClearForm}>清除条件</ClearForm>
          <Button onClick={confirm}>搜索</Button>
        </FormWrap>
      </Wrap>
    </SearchLine>
  )
}
