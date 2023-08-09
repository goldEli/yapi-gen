/* eslint-disable react/no-unknown-property */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react/jsx-no-leaked-render */
// 需求字段-编辑字段

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import CommonModal from '@/components/CommonModal'
import { Checkbox, Form, Input, message, Radio, Select, Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import { getProjectFieIds } from '@store/category/thunk'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { useTranslation } from 'react-i18next'
import { addStoryConfigField, updateStoryConfigField } from '@/services/project'
import { useDispatch, useSelector } from '@store/index'
import { setProjectFieIdsData } from '@store/category/index'
import FormTitleSmall from '@/components/FormTitleSmall'
import CustomSelect from '@/components/CustomSelect'
import { getMessage } from '@/components/Message'

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
  background: 'var(--neutral-n8)',
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
  color: 'var(--primary-d2)',
  cursor: 'pointer',
  width: 'max-content',
})

interface Props {
  isVisible: boolean
  onClose(): void
  item?: any
  fieldType?: any
  onInsert(val: any): void
  onEditUpdate(val: any): void
}

const DragHandle = sortableHandle(() => (
  <IconFont
    type="move"
    style={{
      fontSize: 16,
      cursor: 'pointer',
      color: 'var(--neutral-n3)',
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
  const dispatch = useDispatch()
  const [checked, setChecked] = useState(false)
  const [personValue, setPersonValue] = useState('')
  const ChooseDom = useRef<HTMLInputElement>(null)
  const { projectInfo } = useSelector(store => store.project)
  const [form] = Form.useForm()
  const inputRef = useRef<any>()
  const [value, setValue] = useState('')
  const [row, setRow] = useState([
    { value: '', key: new Date().getTime() },
    { value: '', key: new Date().getTime() + 100 },
  ])

  const option = [
    { label: t('newlyAdd.lineText'), value1: '1', value: 'text' },
    { label: t('newlyAdd.moreLineText'), value1: '2', value: 'textarea' },
    { label: t('newlyAdd.radioDropdown'), value1: '3', value: 'select' },
    {
      label: t('newlyAdd.multiDropdown'),
      value1: '4',
      value: 'select_checkbox',
    },
    { label: t('newlyAdd.time'), value1: '7', value: 'date' },
    { label: t('newlyAdd.number'), value1: '8', value: 'number' },
    { label: t('version2.personRadio'), value1: '9', value: 'user_select' },
    {
      label: t('version2.personCheckbox'),
      value1: '10',
      value: 'user_select_checkbox',
    },
    {
      label: t('confirm_that_it_is_checked'),
      value1: '11',
      value: 'single_checkbox',
    },
  ]
  useEffect(() => {
    if (props?.item && props.isVisible) {
      const type = props?.item?.fieldContent.attr
      setValue(type)
      form.setFieldsValue({
        name: props.item.title,
        type,
        remarks: props?.item?.remarks,
      })
      const values = props?.item?.fieldContent?.value
      if (['select', 'select_checkbox'].includes(type)) {
        const val = values?.map((i: any, index: any) => ({
          value: i,
          key: new Date().getTime() * (index + 0.2),
        }))
        setRow(val)
      } else if (type === 'date') {
        values && setChecked(values[0] === 'datetime')
      } else if (type === 'number') {
        values && setChecked(values[0] === 'integer')
      } else if (['user_select', 'user_select_checkbox'].includes(type)) {
        values && setPersonValue(values[0])
      }
    } else if (props.isVisible && props.fieldType) {
      form.setFieldsValue({
        type: props.fieldType.type,
      })
      setValue('')
      setPersonValue('')
      setChecked(false)
      setRow([
        { value: '', key: new Date().getTime() },
        { value: '', key: new Date().getTime() + 100 },
      ])
      const type = props.fieldType.type
      setValue(type)
    }
  }, [props?.item, props.isVisible])

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
    const selObj: any = option?.filter(
      (i: any) => i.value === form.getFieldValue('type'),
    )[0]
    let contentValue
    if (['text', 'textarea'].includes(selObj?.value)) {
      // 文本
      contentValue = ''
    } else if (['select', 'select_checkbox'].includes(selObj?.value)) {
      // 下拉
      const hasNull = row.filter(i => !i.value)
      if (hasNull?.length) {
        getMessage({ msg: t('newlyAdd.notEnterNull'), type: 'warning' })
        return
      }
      contentValue = row.map(i => i.value)
    } else if (selObj?.value === 'date') {
      // 时间
      contentValue = checked ? ['datetime'] : ['date']
    } else if (selObj?.value === 'number') {
      // 整数
      contentValue = checked ? ['integer'] : ['number']
    } else if (
      ['user_select', 'user_select_checkbox'].includes(selObj?.value)
    ) {
      // 人员字段
      if (personValue?.length <= 0) {
        getMessage({ msg: t('version2.chooseNotNull'), type: 'warning' })
        return
      }
      contentValue = [personValue]
    }
    const obj: any = {
      projectId: projectInfo.id,
      name: form.getFieldValue('name'),
      remarks: form.getFieldValue('remarks') || '',
      content: {
        attr: selObj.value,
        value: contentValue,
      },
    }

    if (props?.item?.storyId) {
      try {
        obj.id = props?.item?.storyId
        const res: any = await updateStoryConfigField(obj)
        getMessage({ msg: t('common.editSuccess'), type: 'success' })
        onReset()
        res.data.res && props.onEditUpdate(res.data.res)
      } catch (error) {
        //
      }
    } else {
      try {
        const res = await addStoryConfigField(obj)
        getMessage({ msg: t('common.createSuccess'), type: 'success' })
        props?.onInsert(res.data)
        // 更新项目已有字段数据
        const data: any = await dispatch(getProjectFieIds(projectInfo.id))
        const payloadList: any = data.payload
        dispatch(setProjectFieIdsData(payloadList))
        onReset()
      } catch (error) {
        //
      }
    }
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
  useEffect(() => {
    if (props?.isVisible) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [props?.isVisible])

  return (
    <CommonModal
      isVisible={props?.isVisible}
      title={
        props?.item
          ? t('newlyAdd.editCustomFields')
          : t('newlyAdd.createCustomFields')
      }
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={props?.item?.id ? t('common.confirm') : t('newlyAdd.create')}
    >
      <div
        ref={ChooseDom}
        style={{ maxHeight: 464, overflowY: 'auto', padding: '0 24px 0 24px' }}
      >
        <FormWrap form={form} layout="vertical">
          <ItemWrap notMargin>
            <Form.Item
              label={
                <div>
                  <FormTitleSmall text={t('newlyAdd.fieldsName')} />
                  <Tooltip
                    overlayStyle={{
                      fontSize: '12px',
                      color: 'var(--neutral-n3)',
                    }}
                    trigger={['click']}
                    placement="top"
                    title={t('newlyAdd.nameText')}
                  >
                    <IconFont
                      style={{
                        color: 'var( --neutral-n4)',
                        position: 'absolute',
                        left:
                          localStorage.getItem('language') === 'en'
                            ? '88px'
                            : '68px',
                        top: '4px',
                      }}
                      type="question"
                    />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: '' }]}
              name="name"
              getValueFromEvent={event => {
                return event.target.value.replace(/(?<start>^\s*)/g, '')
              }}
            >
              <Input
                ref={inputRef}
                placeholder={t('newlyAdd.pleaseFieldsName')}
                autoComplete="off"
                maxLength={12}
                autoFocus
              />
            </Form.Item>
          </ItemWrap>
          <Form.Item
            label={t('newlyAdd.fieldsRemark')}
            getValueFromEvent={event => {
              // eslint-disable-next-line require-unicode-regexp
              return event.target.value.replace(/(?<start>^\s*)/g, '')
            }}
            name="remarks"
          >
            <Input.TextArea
              placeholder={t('newlyAdd.pleaseFields')}
              autoSize={{ minRows: 5, maxRows: 5 }}
              maxLength={20}
            />
          </Form.Item>
          <ItemWrap>
            <Form.Item
              className="iconFont"
              label={
                <div>
                  <FormTitleSmall text={t('newlyAdd.fieldsType')} />
                  <Tooltip
                    overlayStyle={{
                      fontSize: '12px',
                      color: 'var(--neutral-n3)',
                    }}
                    trigger={['click']}
                    placement="top"
                    title={t('newlyAdd.pleaseFieldsType')}
                  >
                    <IconFont
                      style={{
                        color: 'var( --neutral-n4)',
                        position: 'absolute',
                        left:
                          localStorage.getItem('language') === 'en'
                            ? '88px'
                            : '68px',
                        top: '4px',
                      }}
                      type="question"
                    />
                  </Tooltip>
                </div>
              }
              rules={[{ required: true, message: '' }]}
              name="type"
            >
              <CustomSelect
                placeholder={t('common.pleaseSelect')}
                allowClear
                showArrow
                optionFilterProp="label"
                getPopupContainer={(node: any) => node}
                showSearch
                disabled={props?.item?.id}
                options={option}
                onSelect={(val: any) => setValue(val)}
                onClear={() => setValue('')}
              />
            </Form.Item>

            {value &&
              value !== 'text' &&
              value !== 'textarea' &&
              value !== 'single_checkbox' && (
                <ChooseWrap>
                  {value === 'date' && (
                    <Checkbox
                      checked={checked}
                      onChange={e => setChecked(e.target.checked)}
                    >
                      {t('newlyAdd.hasShowTime')}
                    </Checkbox>
                  )}
                  {value === 'number' && (
                    <Checkbox
                      checked={checked}
                      onChange={e => setChecked(e.target.checked)}
                    >
                      {t('newlyAdd.onlyInt')}
                    </Checkbox>
                  )}
                  {(value === 'user_select' ||
                    value === 'user_select_checkbox') && (
                    <>
                      <div
                        style={{
                          fontSize: 14,
                          color: 'var(--neutral-n1-d1)',
                          marginBottom: 12,
                          fontFamily: 'SiYuanMedium',
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
                  {![
                    'date',
                    'number',
                    'user_select',
                    'user_select_checkbox',
                  ].includes(value) && (
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
                        {row?.map((_i: any, idx: number) => (
                          <SortItemLi
                            helperClass="row-dragging"
                            key={_i.key}
                            index={idx}
                          >
                            <OptionsItemWrap key={_i.key}>
                              <DragHandle />
                              <Input
                                defaultValue={row[idx].value}
                                style={{ width: 396 }}
                                placeholder={t('newlyAdd.pleaseParams')}
                                onChange={e => onChangeValue(e, idx)}
                              />
                              <IconFont
                                type="close"
                                style={{
                                  fontSize: 16,
                                  cursor:
                                    row?.length === 1
                                      ? 'not-allowed'
                                      : 'pointer',
                                  color: 'var(--neutral-n3)',
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
