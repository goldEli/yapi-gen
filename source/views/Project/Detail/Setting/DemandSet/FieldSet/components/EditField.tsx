/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Checkbox, Form, Input, message, Select, Space } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useMemo, useState } from 'react'
import { random } from 'lodash'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { useModel } from '@/models'
import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  '.flex1': {
    margin: 0,
    padding: 0,
  },
  '.flex': {
    listStyle: 'none',
    visibility: 'visible',
  },
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

const DragHandle = sortableHandle(() => (
  <IconFont
    type="move"
    style={{
      fontSize: 16,
      cursor: 'pointer',
      color: '#969799',
    }}
  />
))

// 拖拽容器
const SortContainer = sortableContainer<any>((props: any) => <ul className="flex flex1" {...props} />)

// 拖拽元素
const SortItemLi = sortableElement<any>((props: any) => <li className="flex" {...props} />)

const EditFiled = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { option, updateStoryConfigField, addStoryConfigField }
    = useModel('project')
  const [checked, setChecked] = useState(false)
  const [form] = Form.useForm()
  const [value, setValue] = useState('')
  const [row, setRow] = useState([
    { value: '', key: `${random()}_${new Date()}` },
    { value: '', key: `${random() + 100}_${new Date()}` },
  ])

  useEffect(() => {
    if (props?.item?.id) {
      form.setFieldsValue(props?.item)
      setValue(props?.item?.type)
      if (['3', '4', '5', '6'].includes(props?.item?.type)) {
        const values = props?.item?.values?.map((i: any) => ({
          value: i,
          key: `${random() + Number(i) * 10}_${new Date()}`,
        }))
        setRow(values)
      } else if (props?.item?.type === '7') {
        setChecked(props?.item?.values[0] === 'datetime')
      } else if (props?.item?.type === '8') {
        setChecked(props?.item?.values[0] === 'integer')
      }
    } else {
      form.resetFields()
      setValue('')
      setChecked(false)
      setRow([
        { value: '', key: `${random()}_${new Date()}` },
        { value: '', key: `${random() + 100}_${new Date()}` },
      ])
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose()
    setTimeout(() => {
      form.resetFields()
      setValue('')
      setChecked(false)
      setRow([
        { value: '', key: `${random()}_${new Date()}` },
        { value: '', key: `${random() + 100}_${new Date()}` },
      ])
    }, 100)
  }

  const onClose = () => {
    onReset()
  }

  const onConfirm = async () => {
    await form.validateFields()
    const selObj = option?.filter(
      i => i.value === form.getFieldValue('type'),
    )[0]
    let contentValue

    if (['1', '2'].includes(selObj?.value)) {

      // 文本
      contentValue = ''
    } else if (['3', '4', '5', '6'].includes(selObj?.value)) {

      // 下拉
      contentValue = row.map(i => i.value)
    } else if (selObj?.value === '7') {

      // 时间
      contentValue = checked ? ['datetime'] : ['date']
    } else if (selObj?.value === '8') {

      // 整数
      contentValue = checked ? ['integer'] : ['number']
    }

    const obj: any = {
      projectId: paramsData.id,
      name: form.getFieldValue('name'),
      remarks: form.getFieldValue('remarks') || '',
      content: {
        attr: selObj.type,
        value: contentValue,
      },
    }

    if (props?.item?.id) {
      try {
        obj.id = props?.item?.id
        await updateStoryConfigField(obj)
        message.success(t('common.editSuccess'))
      } catch (error) {

        //
      }
    } else {
      try {
        await addStoryConfigField(obj)
        message.success(t('common.createSuccess'))
      } catch (error) {

        //
      }
    }

    onReset()
    props?.onUpdate()
  }

  const onChangeValue = (e: any, idx: number) => {
    row[idx].value = e.target.value
    setRow(row)
  }

  const onDelRow = (key: any) => {
    const arr = row.filter((e, i) => e.key !== key)
    setRow(arr)
  }

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        row.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      setRow(newData)
    }
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
        <Form.Item label="字段备注" name="remarks">
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
              {value === '7' && (
                <Checkbox
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                >
                  包含时分
                </Checkbox>
              )}
              {value === '8' && (
                <Checkbox
                  checked={checked}
                  onChange={e => setChecked(e.target.checked)}
                >
                  仅为整数
                </Checkbox>
              )}
              {value !== '8' && value !== '7' && (
                <OptionsWrap>
                  <AddWrap
                    onClick={() => setRow([
                      ...row,
                      { value: '', key: `${random()}_${new Date()}` },
                    ])
                    }
                  >
                    <IconFont type="plus" />
                    <span>添加选项</span>
                  </AddWrap>
                  <SortContainer
                    useDragHandle
                    onSortEnd={(values: any) => onSortEnd(values)}
                  >
                    {row.map((_i: any, idx: number) => (
                      <SortItemLi key={_i.key} index={idx}>
                        <OptionsItemWrap key={_i.key}>
                          <DragHandle />
                          <Input
                            defaultValue={row[idx].value}
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
                            onClick={() => onDelRow(_i.key)}
                          />
                        </OptionsItemWrap>
                      </SortItemLi>
                    ))}
                  </SortContainer>
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
