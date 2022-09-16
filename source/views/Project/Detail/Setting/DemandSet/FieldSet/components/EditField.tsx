/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Checkbox, Form, Input, Select, Space } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const ItemWrap = styled.div<{ notMargin?: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
  },
  ({ notMargin }) => ({
    '.ant-form-item': {
      margin: notMargin ? '0!important' : '24px 0 0 0',
    },
  }),
)

const ChooseWrap = styled.div({
  marginTop: 8,
  borderRadius: 6,
  background: '#F2F2F4',
  padding: 16,
})

const OptionsWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const OptionsItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 16,
})

const AddWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#2877ff',
  cursor: 'pointer',
})

interface Props {
  isVisible: boolean
  onClose(): void
  item?: any
  onUpdate(): void
}

const option = [
  { label: '单行文本', value: '1', type: 'input' },
  { label: '多行文本', value: '2', type: 'textArea' },
  { label: '单选下拉列表', value: '3', type: 'select' },
  { label: '多选下拉列表', value: '4', type: 'multiple' },
  { label: '复选框', value: '5', type: 'checkbox' },
  { label: '单选框', value: '6', type: 'radio' },
  { label: '日期', value: '7', type: 'time' },
  { label: '数值型', value: '8', type: 'number' },
]

const EditFiled = (props: Props) => {
  const [form] = Form.useForm()
  const [value, setValue] = useState('')
  const [row, setRow] = useState([{ value: '' }, { value: '' }])

  const onReset = () => {
    form.resetFields()
    setValue('')
    setRow([{ value: '' }, { value: '' }])
  }

  const onClose = () => {
    props?.onClose()
    setTimeout(() => {
      onReset()
    }, 100)
  }

  const onConfirm = () => {
    form.validateFields()

    // 点击保存后
    // console.log(row)
  }

  const onChangeValue = (e: any, idx: number) => {
    row[idx].value = e.target.value
    setRow(row)
  }

  const onDelRow = (idx: number) => {
    const arr = row.filter((e, i) => i !== idx)
    setRow(arr)
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title={props?.item?.id ? '编辑自定义字段' : '创建自定义字段'}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={props?.item?.id ? '创建' : '确定'}
    >
      <FormWrap form={form} layout="vertical">
        <ItemWrap notMargin>
          <Form.Item
            label="字段名称"
            rules={[{ required: true, message: '' }]}
            name="name"
          >
            <Input placeholder="请输入字段名称" autoComplete="off" autoFocus />
          </Form.Item>
          <div style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
            输入一个符合阅读习惯的短名字,最多12个字符,不能是系统字段,且不能与已有的自定义字段重名
          </div>
        </ItemWrap>
        <Form.Item label="字段备注" name="remark">
          <Input.TextArea
            placeholder="备注信息可以用来提示用户如何填写字段值 (比如“请输入数字”)"
            autoSize={{ minRows: 5, maxRows: 5 }}
          />
        </Form.Item>
        <ItemWrap>
          <Form.Item
            label="字段类型"
            rules={[{ required: true, message: '' }]}
            name="type"
          >
            <Select
              placeholder="请选择"
              allowClear
              showArrow
              optionFilterProp="label"
              getPopupContainer={node => node}
              showSearch
              options={option}
              onSelect={(val: any) => setValue(val)}
              onClear={() => setValue('')}
            />
          </Form.Item>
          <div style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
            根据需要可选择不同的字段类型,选择的字段类型会对是否配置字段选项产生影响
          </div>
          {value && value !== '1' && value !== '2' ? (
            <ChooseWrap>
              {value === '7' && <Checkbox>包含时分</Checkbox>}
              {value === '8' && <Checkbox>仅为整数</Checkbox>}
              {value !== '8' && value !== '7' && (
                <OptionsWrap>
                  <AddWrap onClick={() => setRow([...row, { value: '' }])}>
                    <IconFont type="plus" />
                    <span>添加选项</span>
                  </AddWrap>
                  {row.map((_i: any, idx: number) => (
                    <OptionsItemWrap key={idx}>
                      <IconFont
                        type="move"
                        style={{
                          fontSize: 16,
                          cursor: 'pointer',
                          color: '#969799',
                        }}
                      />
                      <Input
                        value={row[idx].value}
                        style={{ width: 276 }}
                        placeholder="请输入参数值"
                        onChange={e => onChangeValue(e, idx)}
                      />
                      <IconFont
                        type="close"
                        style={{
                          fontSize: 16,
                          cursor: 'pointer',
                          color: '#969799',
                        }}
                        onClick={() => onDelRow(idx)}
                      />
                    </OptionsItemWrap>
                  ))}
                </OptionsWrap>
              )}
            </ChooseWrap>
          ) : null}
        </ItemWrap>
      </FormWrap>
    </CommonModal>
  )
}

export default EditFiled
