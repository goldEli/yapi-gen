/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import styled from '@emotion/styled'
import { Form, Select, Button } from 'antd'
import { SearchLine } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'

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

const SearchList = (props: Props) => {
  const { getDepartmentSelectList, getPositionSelectList, getRoleList }
    = useModel('staff')
  const [form] = Form.useForm()
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [positionOptions, setPositionOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const onClearForm = async () => {
    form.resetFields()
    const value = await form.validateFields()

    props.onSearch(value)
  }
  const init = async () => {
    const res = await getDepartmentSelectList()

    setDepartmentOptions(res.data)

    const res2 = await getPositionSelectList()
    setPositionOptions(res2.data)
    const res3 = await getRoleList()
    setRoleOptions(res3.data)
  }

  useEffect(() => {
    init()
  }, [])

  const confirm = async () => {
    const value = await form.validateFields()

    props.onSearch(value)
  }
  return (
    <SearchLine>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          <SelectWrapBedeck>
            <Form.Item name="department">
              <SelectWrap
                label="部门"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                {departmentOptions.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <Form.Item name="position">
              <SelectWrap
                label="职位"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                {positionOptions.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <Form.Item name="userGroup">
              <SelectWrap
                label="权限组"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                {roleOptions.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
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

export default SearchList
