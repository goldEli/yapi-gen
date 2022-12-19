/* eslint-disable react/jsx-no-leaked-render */
// 需求字段-编辑字段

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Checkbox, Form, Input, message, Radio, Select } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
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
    margin: '22px 0 0 0',
  },
})

const ItemWrap = styled.div<{ notMargin?: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
  },
  ({ notMargin }) => ({
    '.ant-form-item': {
      margin: notMargin ? '0!important' : '22px 0 0 0',
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
  padding: '4px 0',
})

const AddWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#2877ff',
  cursor: 'pointer',
  width: 'max-content',
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
      marginRight: 12,
    }}
  />
))

// 拖拽容器
const SortContainer = sortableContainer<any>((props: any) => (
  <ul className="flex flex1" {...props} />
))
// 拖拽元素
const SortItemLi = sortableElement<any>((props: any) => (
  <li helperClass="row-dragging" {...props} />
))

const EditFiled = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { option, updateStoryConfigField, addStoryConfigField } =
    useModel('project')
  const [checked, setChecked] = useState(false)
  const [personValue, setPersonValue] = useState('')
  const ChooseDom = useRef<HTMLInputElement>(null)
  const [form] = Form.useForm()
  const [value, setValue] = useState('')
  const [row, setRow] = useState([
    { value: '', key: new Date().getTime() },
    { value: '', key: new Date().getTime() + 100 },
  ])

  useEffect(() => {
    if (props?.item?.id) {
      form.setFieldsValue(props?.item)
      setValue(props?.item?.type)
      if (['3', '4', '5', '6'].includes(props?.item?.type)) {
        const values = props?.item?.values?.map((i: any, index: any) => ({
          value: i,
          key: new Date().getTime() * (index + 0.2),
        }))
        setRow(values)
      } else if (props?.item?.type === '7') {
        setChecked(props?.item?.values[0] === 'datetime')
      } else if (props?.item?.type === '8') {
        setChecked(props?.item?.values[0] === 'integer')
      } else if (['9', '10'].includes(props?.item?.type)) {
        setPersonValue(props?.item?.values[0])
      }
    } else {
      form.resetFields()
      setValue('')
      setPersonValue('')
      setChecked(false)
      setRow([
        { value: '', key: new Date().getTime() },
        { value: '', key: new Date().getTime() + 100 },
      ])
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose()
    setTimeout(() => {
      form.resetFields()
      setValue('')
      setChecked(false)
      setPersonValue('')
      setRow([
        { value: '', key: new Date().getTime() },
        { value: '', key: new Date().getTime() + 100 },
      ])
    }, 100)
  }

  const onClose = () => {
    onReset()
  }

  const onConfirm = async () => {
    await form.validateFields()
    const selObj = option?.filter(
      (i: any) => i.value === form.getFieldValue('type'),
    )[0]
    let contentValue

    if (['1', '2'].includes(selObj?.value)) {
      // 文本
      contentValue = ''
    } else if (['3', '4', '5', '6'].includes(selObj?.value)) {
      // 下拉
      const hasNull = row.filter(i => !i.value)
      if (hasNull?.length) {
        message.warning(t('newlyAdd.notEnterNull'))
        return
      }
      contentValue = row.map(i => i.value)
    } else if (selObj?.value === '7') {
      // 时间
      contentValue = checked ? ['datetime'] : ['date']
    } else if (selObj?.value === '8') {
      // 整数
      contentValue = checked ? ['integer'] : ['number']
    } else if (['9', '10'].includes(selObj?.value)) {
      // 人员字段
      if (personValue?.length <= 0) {
        message.warning(t('version2.chooseNotNull'))
        return
      }
      contentValue = [personValue]
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
    if (row.length > 1) {
      const arr = row.filter((e, i) => e.key !== key)
      setRow(arr)
    }
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

  const onAddChoose = () => {
    setRow([...row, { value: '', key: new Date().getTime() * 0.21 }])
    setTimeout(() => {
      const dom: any = ChooseDom?.current
      dom.scrollTop = dom.scrollHeight
    }, 1)
  }

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title={
        props?.item?.id
          ? t('newlyAdd.editCustomFields')
          : t('newlyAdd.createCustomFields')
      }
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={props?.item?.id ? t('common.confirm') : t('newlyAdd.create')}
    >
      <div
        ref={ChooseDom}
        style={{ maxHeight: 464, overflowY: 'auto', padding: '0 16px 0 2px' }}
      >
        <FormWrap form={form} layout="vertical">
          <ItemWrap notMargin>
            <Form.Item
              label={t('newlyAdd.fieldsName')}
              rules={[{ required: true, message: '' }]}
              name="name"
            >
              <Input
                placeholder={t('newlyAdd.pleaseFieldsName')}
                autoComplete="off"
                maxLength={12}
                autoFocus
              />
            </Form.Item>
            <div style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
              {t('newlyAdd.nameText')}
            </div>
          </ItemWrap>
          <Form.Item label={t('newlyAdd.fieldsRemark')} name="remarks">
            <Input.TextArea
              placeholder={t('newlyAdd.pleaseFields')}
              autoSize={{ minRows: 5, maxRows: 5 }}
              maxLength={20}
            />
          </Form.Item>
          <ItemWrap>
            <Form.Item
              label={t('newlyAdd.fieldsType')}
              rules={[{ required: true, message: '' }]}
              name="type"
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                allowClear
                showArrow
                optionFilterProp="label"
                getPopupContainer={node => node}
                showSearch
                disabled={props?.item?.id}
                options={option}
                onSelect={(val: any) => setValue(val)}
                onClear={() => setValue('')}
              />
            </Form.Item>
            <div style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
              {t('newlyAdd.pleaseFieldsType')}
            </div>
            {value && value !== '1' && value !== '2' && (
              <ChooseWrap>
                {value === '7' && (
                  <Checkbox
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                  >
                    {t('newlyAdd.hasShowTime')}
                  </Checkbox>
                )}
                {value === '8' && (
                  <Checkbox
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                  >
                    {t('newlyAdd.onlyInt')}
                  </Checkbox>
                )}
                {(value === '9' || value === '10') && (
                  <>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#323233',
                        marginBottom: 12,
                        fontWeight: 500,
                      }}
                    >
                      {t('version2.chooseRange')}
                    </div>
                    <Radio.Group
                      value={personValue}
                      onChange={e => setPersonValue(e.target.value)}
                    >
                      <Radio value="projectMember">
                        {t('project.projectMember')}
                      </Radio>
                      <Radio value="companyMember">
                        {t('situation.companyStaff')}
                      </Radio>
                    </Radio.Group>
                  </>
                )}
                {!['7', '8', '9', '10'].includes(value) && (
                  <OptionsWrap>
                    <AddWrap onClick={onAddChoose}>
                      <IconFont type="plus" />
                      <span>{t('newlyAdd.addChoose')}</span>
                    </AddWrap>
                    <SortContainer
                      helperClass="row-dragging"
                      useDragHandle
                      onSortEnd={(values: any) => onSortEnd(values)}
                    >
                      {row.map((_i: any, idx: number) => (
                        <SortItemLi
                          helperClass="row-dragging"
                          key={_i.key}
                          index={idx}
                        >
                          <OptionsItemWrap key={_i.key}>
                            <DragHandle />
                            <Input
                              defaultValue={row[idx].value}
                              style={{ width: 276 }}
                              placeholder={t('newlyAdd.pleaseParams')}
                              onChange={e => onChangeValue(e, idx)}
                            />
                            <IconFont
                              type="close"
                              style={{
                                fontSize: 16,
                                cursor:
                                  row?.length === 1 ? 'not-allowed' : 'pointer',
                                color: '#969799',
                                marginLeft: 12,
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
            )}
          </ItemWrap>
        </FormWrap>
      </div>
    </CommonModal>
  )
}

export default EditFiled
